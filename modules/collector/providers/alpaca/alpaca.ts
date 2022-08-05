import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import Web3 from 'web3';

import envConfig from '../../../../configs/env';
import { AlpacaProtocolConfig } from '../../../../configs/protocols/alpaca';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData } from '../../types';

export class AlpacaProvider extends CollectorProvider {
  public readonly name: string = 'collector.alpaca';

  constructor(configs: AlpacaProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};

    for (let poolConfig of this.configs.lendingPools) {
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

      // get history price
      let historyPrice: number;
      if (historyPrices[poolConfig.underlying.coingeckoId]) {
        historyPrice = historyPrices[poolConfig.underlying.coingeckoId];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(poolConfig.underlying.coingeckoId, fromTime);
        historyPrices[poolConfig.underlying.coingeckoId] = historyPrice;
      }

      for (let event of events) {
        // count transaction
        if (!transactions[event.transactionId.split(':')[0]]) {
          data.transactionCount += 1;
          transactions[event.transactionId.split(':')[0]] = true;
        }

        // count user
        // mint action, count to address as user
        if (
          event.returnValues.from === ethers.constants.AddressZero &&
          !addresses[normalizeAddress(event.returnValues.to)]
        ) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.to)] = true;
        }
        // burn action, count from address as user
        if (
          event.returnValues.to === ethers.constants.AddressZero &&
          !addresses[normalizeAddress(event.returnValues.from)]
        ) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.from)] = true;
        }
        if (event.returnValues.killer && !addresses[normalizeAddress(event.returnValues.killer)]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.killer)] = true;
        }
        if (event.returnValues.owner && !addresses[normalizeAddress(event.returnValues.owner)]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.owner)] = true;
        }

        if (event.event === 'Transfer') {
          if (
            event.returnValues.from === ethers.constants.AddressZero ||
            event.returnValues.to === ethers.constants.AddressZero
          ) {
            // supply & withdraw
            let volume = 0;
            if (event.returnValues.amount) {
              volume = new BigNumber(event.returnValues.amount)
                .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
                .multipliedBy(historyPrice)
                .toNumber();
            } else if (event.returnValues.value) {
              volume = new BigNumber(event.returnValues.value)
                .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
                .multipliedBy(historyPrice)
                .toNumber();
            }

            data.volumeInUseUSD += volume;
          }
        }
      }

      // count tvl
      const blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
        poolConfig.chainConfig.subgraph.blockSubgraph,
        fromTime
      );
      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );
      const underlyingContract = new web3.eth.Contract(
        poolConfig.contractAbi,
        poolConfig.underlying.chains[poolConfig.chainConfig.name].address
      );
      const balance = await underlyingContract.methods.balanceOf(poolConfig.contractAddress).call(blockAtTimestamp);

      data.totalValueLockedUSD += new BigNumber(balance.toString())
        .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
        .multipliedBy(historyPrice)
        .toNumber();
    }

    return data;
  }
}
