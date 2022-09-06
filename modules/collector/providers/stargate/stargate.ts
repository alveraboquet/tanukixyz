import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import envConfig from '../../../../configs/env';
import { StargatePool, StargateProtocolConfig } from '../../../../configs/protocols/stargate';
import { AaveProtocolConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolExchangeActionData, ProtocolTokenData } from '../../types';

export class StargateProvider extends CollectorProvider {
  public readonly name: string = 'collector.stargate';

  constructor(configs: StargateProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      feeUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
      detail: {
        tokens: [],
      },
    };

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};
    const tokens: { [key: string]: ProtocolTokenData } = {};
    const actions: ProtocolExchangeActionData = {
      addLiquidityVolumeUSD: 0,
      removeLiquidityVolumeUSD: 0,
      swapVolumeUSD: 0,
    };

    const configs: AaveProtocolConfig = this.configs;
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    for (const poolConfig of configs.pools) {
      const stargateLPConfig = poolConfig as StargatePool;
      const tokenAddress = normalizeAddress(stargateLPConfig.token.chains[stargateLPConfig.chainConfig.name].address);
      const tokenDecimals = stargateLPConfig.token.chains[stargateLPConfig.chainConfig.name].decimals;
      const tokenKey = `${stargateLPConfig.chainConfig.name}:${tokenAddress}`;

      // get history price
      let historyPrice: number;
      if (historyPrices[stargateLPConfig.token.coingeckoId]) {
        historyPrice = historyPrices[stargateLPConfig.token.coingeckoId];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(stargateLPConfig.token.coingeckoId, fromTime);
        historyPrices[stargateLPConfig.token.coingeckoId] = historyPrice;
      }

      tokens[tokenKey] = {
        chain: stargateLPConfig.chainConfig.name,
        symbol: stargateLPConfig.token.symbol,
        decimals: tokenDecimals,
        address: tokenAddress,

        volumeInUseUSD: 0,
        totalValueLockedUSD: 0,
        transactionCount: 0,
      };

      const events = await eventCollection
        .find({
          chain: poolConfig.chainConfig.name,
          contract: normalizeAddress(poolConfig.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      for (const event of events) {
        if (!transactions[event.transactionId.split(':')[0]]) {
          transactions[event.transactionId.split(':')[0]] = true;
          data.transactionCount += 1;
          tokens[tokenKey].transactionCount += 1;
        }

        if (event.returnValues.from && !addresses[normalizeAddress(event.returnValues.from)]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.from)] = true;
        }
        if (event.returnValues.to && !addresses[normalizeAddress(event.returnValues.to)]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.to)] = true;
        }

        const volume = new BigNumber(event.returnValues.amountSD)
          // stargate use default 6 decimals value for BUSD
          .dividedBy(stargateLPConfig.token.symbol === 'BUSD' ? 1e16 : new BigNumber(10).pow(tokenDecimals))
          .multipliedBy(historyPrice)
          .toNumber();
        switch (event.event) {
          case 'Mint': {
            actions.addLiquidityVolumeUSD += volume;
            break;
          }
          case 'Burn': {
            actions.removeLiquidityVolumeUSD += volume;
            break;
          }
          case 'Swap': {
            actions.swapVolumeUSD += volume;
            break;
          }
        }

        tokens[tokenKey].volumeInUseUSD += volume;
        data.volumeInUseUSD += volume;
      }

      const blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
        poolConfig.chainConfig.subgraph?.blockSubgraph as string,
        fromTime
      );
      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );

      let balance = 0;
      if (stargateLPConfig.token.symbol === 'ETH') {
        const contract = new web3.eth.Contract(poolConfig.contractAbi, poolConfig.contractAddress);
        try {
          balance = await contract.methods.totalLiquidity().call(blockAtTimestamp);
        } catch (e: any) {}
      } else {
        const contract = new web3.eth.Contract(poolConfig.contractAbi, tokenAddress);
        try {
          balance = await contract.methods.balanceOf(poolConfig.contractAddress).call(blockAtTimestamp);
        } catch (e: any) {}
      }

      const tvl = new BigNumber(balance.toString())
        .dividedBy(new BigNumber(10).pow(tokenDecimals))
        .multipliedBy(historyPrice)
        .toNumber();
      tokens[tokenKey].totalValueLockedUSD += tvl;
      data.totalValueLockedUSD += tvl;
    }

    if (data.detail) {
      data.detail.actions = actions;
      for (const [, token] of Object.entries(tokens)) {
        data.detail.tokens.push(token);
      }
    }

    return data;
  }
}
