import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import envConfig from '../../../../configs/env';
import { AbracadabraProtocolConfig } from '../../../../configs/protocols/abracadabra';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData } from '../../types';
import { getHistoryPrice, getMarketConfigByAddress } from './helpers';

export class AbracadabraProvider extends CollectorProvider {
  public readonly name: string = 'collector.abracadabra';

  constructor(configs: AbracadabraProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      feeUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: AbracadabraProtocolConfig = this.configs as AbracadabraProtocolConfig;
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};

    for (let poolId = 0; poolId < configs.markets.length; poolId++) {
      const events = await eventCollection
        .find({
          contract: normalizeAddress(configs.markets[poolId].contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();
      const poolConfig = getMarketConfigByAddress(configs.markets[poolId].contractAddress, configs.markets);
      if (!poolConfig) {
        logger.onDebug({
          source: this.name,
          message: 'market config not found',
          props: {
            contract: normalizeAddress(configs.markets[poolId].contractAddress),
          },
        });
        continue;
      }

      if (events.length <= 0) continue;

      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );

      // get history price from on-chain oracle
      let historyPrice: number;
      if (historyPrices[normalizeAddress(poolConfig.contractAddress)]) {
        historyPrice = historyPrices[normalizeAddress(poolConfig.contractAddress)];
      } else {
        try {
          historyPrice = await getHistoryPrice(web3, poolConfig, events[0].blockNumber);
          historyPrices[normalizeAddress(poolConfig.contractAddress)] = historyPrice;
        } catch (e: any) {
          logger.onWarn({
            source: this.name,
            message: 'failed to get price from oracle',
            props: {
              chain: configs.markets[poolId].chainConfig.name,
              market: normalizeAddress(configs.markets[poolId].contractAddress),
              error: e.message,
            },
          });
          historyPrice = 0;
        }
      }

      for (let i = 0; i < events.length; i++) {
        // count transaction
        if (!transactions[events[i].transactionId.split(':')[0]]) {
          data.transactionCount += 1;
          transactions[events[i].transactionId.split(':')[0]] = true;
        }

        // count user
        if (!addresses[normalizeAddress(events[i].returnValues['from'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['from'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['to'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['to'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['user'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['user'])] = true;
        }

        // count volume
        switch (events[i].event) {
          case 'LogAddCollateral': {
            data.volumeInUseUSD += new BigNumber(events[i].returnValues.share)
              .dividedBy(1e18)
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
        }
      }
    }

    // count liquidity
    for (let poolId = 0; poolId < configs.markets.length; poolId++) {
      const poolConfig = getMarketConfigByAddress(configs.markets[poolId].contractAddress, configs.markets);
      if (!poolConfig) {
        logger.onDebug({
          source: this.name,
          message: 'market config not found',
          props: {
            contract: normalizeAddress(configs.markets[poolId].contractAddress),
          },
        });
        continue;
      }

      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );
      const marketContract = new web3.eth.Contract(
        configs.markets[poolId].contractAbi,
        configs.markets[poolId].contractAddress
      );

      try {
        // get history price from on-chain oracle
        let historyPrice: number;
        if (historyPrices[normalizeAddress(poolConfig.contractAddress)]) {
          historyPrice = historyPrices[normalizeAddress(poolConfig.contractAddress)];
        } else {
          try {
            historyPrice = await getHistoryPrice(web3, poolConfig, null);
            historyPrices[normalizeAddress(poolConfig.contractAddress)] = historyPrice;
          } catch (e: any) {
            logger.onWarn({
              source: this.name,
              message: 'failed to get price from oracle',
              props: {
                chain: configs.markets[poolId].chainConfig.name,
                market: normalizeAddress(configs.markets[poolId].contractAddress),
                error: e.message,
              },
            });
            historyPrice = 0;
          }
        }

        // count liquidity
        const totalCollateralShare = await marketContract.methods.totalCollateralShare().call();
        data.totalValueLockedUSD += new BigNumber(totalCollateralShare).dividedBy(1e18).toNumber() * historyPrice;
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'cannot query history tvl',
          props: {
            chain: poolConfig.chainConfig.name,
            contract: normalizeAddress(poolConfig.contractAddress),
            error: e.message,
          },
        });
      }
    }

    return data;
  }
}
