import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import ERC20Abi from '../../../../configs/abi/ERC20.json';
import envConfig from '../../../../configs/env';
import { CurveProtocolConfig } from '../../../../configs/protocols/curve';
import { TokenConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';

export class CurveProvider extends CollectorProvider {
  public readonly name: string = 'collector.curve';

  constructor(configs: CurveProtocolConfig) {
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

    const configs: CurveProtocolConfig = this.configs;

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const tokens: { [key: string]: ProtocolTokenData } = {};
    const historyPrices: any = {};

    for (const pool of configs.pools) {
      const events = await eventCollection
        .find({
          contract: normalizeAddress(pool.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      for (const event of events) {
        // count transaction
        if (!transactions[event.transactionId.split(':')[0]]) {
          data.transactionCount += 1;
          transactions[event.transactionId.split(':')[0]] = true;
        }

        // count user
        if (event.returnValues['buyer'] && !addresses[normalizeAddress(event.returnValues['buyer'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['buyer'])] = true;
        }
        if (event.returnValues['provider'] && !addresses[normalizeAddress(event.returnValues['provider'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['provider'])] = true;
        }

        if (event.event === 'TokenExchange' || event.event === 'TokenExchangeUnderlying') {
          let soldToken: TokenConfig | null = null;
          let boughtToken: TokenConfig | null = null;
          try {
            soldToken = pool.tokens[Number(event.returnValues.sold_id)];
          } catch (e: any) {
            logger.onDebug({
              source: this.name,
              message: 'curve sold_id token not found',
              props: {
                poolAddress: normalizeAddress(pool.contractAddress),
                soldID: Number(event.returnValues.sold_id),
              },
            });
          }
          try {
            boughtToken = pool.tokens[Number(event.returnValues.bought_id)];
          } catch (e: any) {
            logger.onDebug({
              source: this.name,
              message: 'curve bought_id token not found',
              props: {
                poolAddress: normalizeAddress(pool.contractAddress),
                boughtID: Number(event.returnValues.bought_id),
              },
            });
          }

          if (soldToken) {
            let historyPrice: number = 0;
            if (historyPrices[soldToken.coingeckoId]) {
              historyPrice = historyPrices[soldToken.coingeckoId];
            } else {
              historyPrice = await getHistoryTokenPriceFromCoingecko(soldToken.coingeckoId, fromTime);
              historyPrices[soldToken.coingeckoId] = historyPrice;
            }

            const tokenDecimals: number = soldToken.chains[pool.chainConfig.name].decimals;
            const tokenAddress: string = normalizeAddress(soldToken.chains[pool.chainConfig.name].address);
            if (!tokens[tokenAddress]) {
              tokens[tokenAddress] = {
                chain: pool.chainConfig.name,
                symbol: soldToken.symbol,
                address: tokenAddress,
                decimals: tokenDecimals,

                volumeInUseUSD: 0,
                totalValueLockedUSD: 0,
                transactionCount: 0,
              };
            }

            // calculate volume
            const volume: number = new BigNumber(event.returnValues.tokens_sold.toString())
              .dividedBy(new BigNumber(10).pow(tokenDecimals))
              .multipliedBy(historyPrice)
              .toNumber();

            tokens[tokenAddress].volumeInUseUSD += volume;
            data.volumeInUseUSD += volume;
          }

          if (boughtToken) {
            let historyPrice: number = 0;
            if (historyPrices[boughtToken.coingeckoId]) {
              historyPrice = historyPrices[boughtToken.coingeckoId];
            } else {
              historyPrice = await getHistoryTokenPriceFromCoingecko(boughtToken.coingeckoId, fromTime);
              historyPrices[boughtToken.coingeckoId] = historyPrice;
            }

            const tokenDecimals: number = boughtToken.chains[pool.chainConfig.name].decimals;
            const tokenAddress: string = normalizeAddress(boughtToken.chains[pool.chainConfig.name].address);
            if (!tokens[tokenAddress]) {
              tokens[tokenAddress] = {
                chain: pool.chainConfig.name,
                symbol: boughtToken.symbol,
                address: tokenAddress,
                decimals: tokenDecimals,

                volumeInUseUSD: 0,
                totalValueLockedUSD: 0,
                transactionCount: 0,
              };
            }

            // calculate volume
            const volume: number = new BigNumber(event.returnValues.tokens_bought.toString())
              .dividedBy(new BigNumber(10).pow(tokenDecimals))
              .multipliedBy(historyPrice)
              .toNumber();

            tokens[tokenAddress].volumeInUseUSD += volume;
            data.volumeInUseUSD += volume;
          }
        } else if (event.event === 'AddLiquidity' || event.event === 'RemoveLiquidity') {
          for (let coinId = 0; coinId < event.returnValues.token_amounts.length; coinId++) {
            const token: TokenConfig = pool.tokens[coinId];
            const tokenDecimals: number = token.chains[pool.chainConfig.name].decimals;
            const tokenAddress: string = normalizeAddress(token.chains[pool.chainConfig.name].address);

            if (!tokens[tokenAddress]) {
              tokens[tokenAddress] = {
                chain: pool.chainConfig.name,
                symbol: token.symbol,
                address: tokenAddress,
                decimals: tokenDecimals,

                volumeInUseUSD: 0,
                totalValueLockedUSD: 0,
                transactionCount: 0,
              };
            }

            let historyPrice: number = 0;
            if (historyPrices[token.coingeckoId]) {
              historyPrice = historyPrices[token.coingeckoId];
            } else {
              historyPrice = await getHistoryTokenPriceFromCoingecko(token.coingeckoId, fromTime);
              historyPrices[token.coingeckoId] = historyPrice;
            }

            // calculate volume
            const volume: number = new BigNumber(event.returnValues.token_amounts[coinId].toString())
              .dividedBy(new BigNumber(10).pow(tokenDecimals))
              .multipliedBy(historyPrice)
              .toNumber();

            tokens[tokenAddress].volumeInUseUSD += volume;
            data.volumeInUseUSD += volume;
          }
        }
      }

      for (const token of pool.tokens) {
        let historyPrice: number = 0;
        if (historyPrices[token.coingeckoId]) {
          historyPrice = historyPrices[token.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(token.coingeckoId, fromTime);
          historyPrices[token.coingeckoId] = historyPrice;
        }

        const tokenDecimals: number = token.chains[pool.chainConfig.name].decimals;
        const tokenAddress: string = normalizeAddress(token.chains[pool.chainConfig.name].address);

        const blockAtTimestamp: number = await providers.subgraph.queryBlockAtTimestamp(
          pool.chainConfig.subgraph?.blockSubgraph as string,
          fromTime
        );
        const web3 = new Web3(
          pool.chainConfig.nodeRpcs.archive ? pool.chainConfig.nodeRpcs.archive : pool.chainConfig.nodeRpcs.default
        );

        try {
          const tokenContract = new web3.eth.Contract(ERC20Abi as any, tokenAddress);
          const tokenBalance = await tokenContract.methods.balanceOf(pool.contractAddress).call(blockAtTimestamp);

          if (!tokens[tokenAddress]) {
            tokens[tokenAddress] = {
              chain: pool.chainConfig.name,
              symbol: token.symbol,
              address: tokenAddress,
              decimals: tokenDecimals,

              volumeInUseUSD: 0,
              totalValueLockedUSD: 0,
              transactionCount: 0,
            };
          }

          const tvl = new BigNumber(tokenBalance)
            .dividedBy(new BigNumber(10).pow(tokenDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          data.totalValueLockedUSD += tvl;
          tokens[tokenAddress].totalValueLockedUSD += tvl;
        } catch (e: any) {
          logger.onError({
            source: this.name,
            message: 'failed to query token balance',
            props: {
              token: tokenAddress,
              pool: normalizeAddress(pool.contractAddress),
              block: blockAtTimestamp,
            },
            error: e.message,
          });
        }
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
