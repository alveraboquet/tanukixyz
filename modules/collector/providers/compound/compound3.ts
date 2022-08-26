import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import ERC20Abi from '../../../../configs/abi/ERC20.json';
import envConfig from '../../../../configs/env';
import { Compound3ProtocolConfig } from '../../../../configs/protocols/compound';
import { TokenConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';
import { getCompound3TokenConfig } from './helpers';

export class Compound3Provider extends CollectorProvider {
  public readonly name: string = 'collector.compound3';

  constructor(configs: Compound3ProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,

      detail: {
        tokens: [],
      },
    };

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};
    const tokens: { [key: string]: ProtocolTokenData } = {};

    for (const poolConfig of this.configs.pools) {
      const underlyingAddress = normalizeAddress(poolConfig.underlying.chains[poolConfig.chainConfig.name].address);
      tokens[underlyingAddress] = {
        chain: poolConfig.chainConfig.name,
        symbol: poolConfig.underlying.symbol,
        address: underlyingAddress,
        decimals: poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals,

        volumeInUseUSD: 0,
        totalValueLockedUSD: 0,
        transactionCount: 0,
      };

      for (const collateral of poolConfig.collaterals) {
        const collateralAddress = normalizeAddress(collateral.chains[poolConfig.chainConfig.name].address);
        tokens[collateralAddress] = {
          chain: poolConfig.chainConfig.name,
          symbol: collateral.symbol,
          address: collateralAddress,
          decimals: collateral.chains[poolConfig.chainConfig.name].decimals,

          volumeInUseUSD: 0,
          totalValueLockedUSD: 0,
          transactionCount: 0,
        };
      }

      const events = await eventCollection
        .find({
          contract: normalizeAddress(poolConfig.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );

      for (const event of events) {
        // count user
        if (!addresses[normalizeAddress(event.returnValues['src'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['src'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['to'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['to'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['from'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['from'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['dst'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['dst'])] = true;
        }

        if (event.event === 'Supply' || event.event === 'Withdraw') {
          // count transaction
          if (!transactions[event.transactionId.split(':')[0]]) {
            tokens[underlyingAddress].transactionCount += 1;
            data.transactionCount += 1;

            transactions[event.transactionId.split(':')[0]] = true;
          }

          let historyPrice: number;
          if (historyPrices[poolConfig.underlying.coingeckoId]) {
            historyPrice = historyPrices[poolConfig.underlying.coingeckoId];
          } else {
            historyPrice = await getHistoryTokenPriceFromCoingecko(poolConfig.underlying.coingeckoId, fromTime);
            historyPrices[poolConfig.underlying.coingeckoId] = historyPrice;
          }

          const volume = new BigNumber(event.returnValues.amount)
            .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
            .multipliedBy(historyPrice)
            .toNumber();

          tokens[underlyingAddress].volumeInUseUSD += volume;
          data.volumeInUseUSD += volume;
        } else if (event.event === 'SupplyCollateral' || event.event === 'WithdrawCollateral') {
          const token: TokenConfig | null = getCompound3TokenConfig(
            event.returnValues.asset,
            poolConfig.chainConfig.name,
            poolConfig.collaterals
          );
          if (!token) {
            logger.onDebug({
              source: this.name,
              message: 'asset conbfig not found',
              props: {
                chain: poolConfig.chainConfig.name,
                asset: normalizeAddress(event.returnValues.asset),
              },
            });
          } else {
            let historyPrice: number;
            if (historyPrices[token.coingeckoId]) {
              historyPrice = historyPrices[token.coingeckoId];
            } else {
              historyPrice = await getHistoryTokenPriceFromCoingecko(token.coingeckoId, fromTime);
              historyPrices[token.coingeckoId] = historyPrice;
            }

            const volume = new BigNumber(event.returnValues.amount)
              .dividedBy(new BigNumber(10).pow(token.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();

            data.volumeInUseUSD += volume;
            tokens[normalizeAddress(token.chains[poolConfig.chainConfig.name].address)].volumeInUseUSD += volume;
          }
        }
      }

      try {
        const tokenConfigs: Array<TokenConfig> = [poolConfig.underlying].concat(poolConfig.collaterals);

        const blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
          poolConfig.chainConfig.subgraph.blockSubgraph,
          toTime
        );

        for (const token of tokenConfigs) {
          const tokenAddress = token.chains[poolConfig.chainConfig.name].address;
          const tokenDecimals = token.chains[poolConfig.chainConfig.name].decimals;

          // count liquidity
          const contract = new web3.eth.Contract(ERC20Abi as any, tokenAddress);
          const tokenBalance = await contract.methods.balanceOf(poolConfig.contractAddress).call(blockAtTimestamp);

          let historyPrice: number;
          if (historyPrices[token.coingeckoId]) {
            historyPrice = historyPrices[token.coingeckoId];
          } else {
            historyPrice = await getHistoryTokenPriceFromCoingecko(token.coingeckoId, toTime);
            historyPrices[token.coingeckoId] = historyPrice;
          }

          const liquidity = new BigNumber(tokenBalance)
            .dividedBy(new BigNumber(10).pow(tokenDecimals))
            .multipliedBy(historyPrice)
            .toNumber();

          data.totalValueLockedUSD += liquidity;
          tokens[normalizeAddress(tokenAddress)].totalValueLockedUSD = liquidity;
        }
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'cannot query pool liquidity',
          props: {
            chain: poolConfig.chainConfig.name,
            contract: normalizeAddress(poolConfig.contractAddress),
            error: e.message,
          },
        });
      }
    }

    if (data.detail) {
      for (const [, token] of Object.entries(tokens)) {
        data.detail.tokens.push(token);
      }
    }

    return data;
  }
}
