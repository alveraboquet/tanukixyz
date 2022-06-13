import { Collection } from 'mongodb';
import Web3 from 'web3';

import envConfig from '../../../core/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { InitialDateData } from '../constants';
import * as helpers from '../helpers';
import {
  ILendingProvider,
  LendingConfig,
  LendingData,
  RunLendingAggregatorArgv,
  RunLendingCollectorArgv,
} from '../types';

class LendingProvider implements ILendingProvider {
  public readonly name: string = 'lending.provider';

  public readonly lendingConfig: LendingConfig;

  constructor(lendingConfig: LendingConfig) {
    this.lendingConfig = lendingConfig;
  }

  // override this function
  public async getPoolEvents(props: any): Promise<Array<any>> {
    return [];
  }

  public async runAggregator(options: RunLendingAggregatorArgv): Promise<any> {
    const { providers, initialDate, forceSync } = options;

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.lendingEventSync);
    const dailyDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDaily
    );
    const dateDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDate
    );

    // firstly, we update daily data
    const dailyData: LendingData = {
      supplyVolumeUSD: 0,
      withdrawVolumeUSD: 0,
      borrowVolumeUSD: 0,
      repayVolumeUSD: 0,
      addressCount: 0,
      transactionCount: 0,
    };

    const currentTimestamp = getTimestamp();
    const last24HoursTimestamp = currentTimestamp - 24 * 60 * 60;

    for (let configIdx = 0; configIdx < this.lendingConfig.configs.length; configIdx++) {
      const last24HoursEvents = await eventCollection
        .find({
          protocol: this.lendingConfig.name,
          chain: this.lendingConfig.configs[configIdx].chainConfig.name,
          timestamp: {
            $gte: last24HoursTimestamp,
            $lte: currentTimestamp,
          },
        })
        .toArray();

      const summarizeData: LendingData = await helpers.summarizeDataEvents(this.lendingConfig, last24HoursEvents);
      dailyData.supplyVolumeUSD += summarizeData.supplyVolumeUSD;
      dailyData.withdrawVolumeUSD += summarizeData.withdrawVolumeUSD;
      dailyData.borrowVolumeUSD += summarizeData.borrowVolumeUSD;
      dailyData.repayVolumeUSD += summarizeData.repayVolumeUSD;
      dailyData.addressCount += summarizeData.addressCount;
      dailyData.transactionCount += summarizeData.transactionCount;
    }

    await dailyDataCollection.updateOne(
      {
        module: 'lending',
        name: this.lendingConfig.name,
      },
      {
        $set: {
          module: 'lending',
          name: this.lendingConfig.name,
          ...dailyData,
        },
      },
      {
        upsert: true,
      }
    );

    logger.onInfo({
      source: this.name,
      message: 'updated lending daily data',
      props: {
        protocol: this.lendingConfig.name,
        volumeUSD:
          dailyData.supplyVolumeUSD + dailyData.borrowVolumeUSD + dailyData.borrowVolumeUSD + dailyData.repayVolumeUSD,
      },
    });

    // secondly, update date data
    const today = getTodayUTCTimestamp();
    let startDate = initialDate === 0 ? InitialDateData : initialDate;
    if (!forceSync) {
      const states = await dateDataCollection
        .find({
          module: 'lending',
          name: this.lendingConfig.name,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (states.length > 0) {
        startDate = states[0].date;
      }
    }

    while (startDate <= today) {
      const dateData: LendingData = {
        supplyVolumeUSD: 0,
        withdrawVolumeUSD: 0,
        borrowVolumeUSD: 0,
        repayVolumeUSD: 0,
        addressCount: 0,
        transactionCount: 0,
      };

      for (let configIdx = 0; configIdx < this.lendingConfig.configs.length; configIdx++) {
        const dateEvents = await eventCollection
          .find({
            protocol: this.lendingConfig.name,
            chain: this.lendingConfig.configs[configIdx].chainConfig.name,
            timestamp: {
              $gte: startDate,
              $lt: startDate + 24 * 60 * 60,
            },
          })
          .toArray();

        const summarizeData: LendingData = await helpers.summarizeDataEvents(this.lendingConfig, dateEvents);
        dateData.supplyVolumeUSD += summarizeData.supplyVolumeUSD;
        dateData.withdrawVolumeUSD += summarizeData.withdrawVolumeUSD;
        dateData.borrowVolumeUSD += summarizeData.borrowVolumeUSD;
        dateData.repayVolumeUSD += summarizeData.repayVolumeUSD;
        dateData.addressCount += summarizeData.addressCount;
        dateData.transactionCount += summarizeData.transactionCount;
      }

      await dateDataCollection.updateOne(
        {
          module: 'lending',
          name: this.lendingConfig.name,
          date: startDate,
        },
        {
          $set: {
            module: 'lending',
            name: this.lendingConfig.name,
            date: startDate,
            ...dateData,
          },
        },
        {
          upsert: true,
        }
      );

      logger.onInfo({
        source: this.name,
        message: 'updated lending date data',
        props: {
          protocol: this.lendingConfig.name,
          date: new Date(startDate * 1000).toISOString().split('T')[0],
          volumeUSD:
            dateData.supplyVolumeUSD + dateData.borrowVolumeUSD + dateData.borrowVolumeUSD + dateData.repayVolumeUSD,
        },
      });

      startDate += 24 * 60 * 60;
    }
  }

  public async runCollector(options: RunLendingCollectorArgv): Promise<any> {
    const { providers } = options;

    // get db collections
    const stateCollection = await providers.database.getCollection(envConfig.database.collections.globalState);
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.lendingEventSync);
    eventCollection.createIndex({ chain: 1, protocol: 1, txid: 1 }, { background: true });
    eventCollection.createIndex({ chain: 1, protocol: 1, timestamp: 1 }, { background: true });

    const configs = this.lendingConfig.configs;
    for (let configID = 0; configID < configs.length; configID++) {
      const lendingConfig = configs[configID];

      const web3 = new Web3(
        lendingConfig.chainConfig.nodeRpcs.event
          ? lendingConfig.chainConfig.nodeRpcs.event
          : lendingConfig.chainConfig.nodeRpcs.default
      );

      const STEP = 2000;
      const latestBlock = await web3.eth.getBlockNumber();

      for (let i = 0; i < lendingConfig.pools.length; i++) {
        let startBlock = lendingConfig.pools[i].genesisBlock;
        const syncedState = await stateCollection
          .find({
            name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${lendingConfig.pools[i].underlyingSymbol}`,
          })
          .limit(1)
          .toArray();
        if (syncedState.length > 0) {
          startBlock = syncedState[0].blockNumber;
        }

        while (startBlock <= latestBlock) {
          const startExeTime = Math.floor(new Date().getTime() / 1000);

          const toBlock = startBlock + STEP > latestBlock ? latestBlock : startBlock + STEP;
          const events = await this.getPoolEvents({
            chainConfig: lendingConfig.chainConfig,
            poolConfig: lendingConfig.pools[i],
            fromBlock: startBlock,
            toBlock: toBlock,
          });
          const operations: Array<any> = [];
          for (let eventIdx = 0; eventIdx < events.length; eventIdx++) {
            operations.push({
              updateOne: {
                filter: {
                  protocol: this.lendingConfig.name,
                  chain: lendingConfig.chainConfig.name,
                  txid: events[eventIdx].txid,
                },
                update: {
                  $set: {
                    protocol: this.lendingConfig.name,
                    chain: lendingConfig.chainConfig.name,
                    txid: events[eventIdx].txid,
                    blockNumber: events[eventIdx].blockNumber,
                    timestamp: events[eventIdx].timestamp,
                    poolAddress: events[eventIdx].poolAddress,
                    underlyingSymbol: events[eventIdx].underlyingSymbol,
                    underlyingDecimals: events[eventIdx].underlyingDecimals,

                    event: events[eventIdx].event,
                    eventData: events[eventIdx].eventData,
                  },
                },
                upsert: true,
              },
            });
          }

          if (operations.length > 0) {
            await eventCollection.bulkWrite(operations);
          }

          await stateCollection.updateOne(
            {
              name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${lendingConfig.pools[i].underlyingSymbol}`,
            },
            {
              $set: {
                name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${lendingConfig.pools[i].underlyingSymbol}`,
                blockNumber: toBlock,
              },
            },
            {
              upsert: true,
            }
          );

          const endExeTime = Math.floor(new Date().getTime() / 1000);
          const elapsed = endExeTime - startExeTime;

          logger.onInfo({
            source: this.name,
            message: 'sync lending events',
            props: {
              name: this.lendingConfig.name,
              chain: lendingConfig.chainConfig.name,
              pool: lendingConfig.pools[i].underlyingSymbol,
              block: toBlock,
              events: operations.length,
              elapsed: `${elapsed}s`,
            },
          });

          startBlock += STEP;
        }
      }
    }
  }
}

export default LendingProvider;
