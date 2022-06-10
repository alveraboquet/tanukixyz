import Web3 from 'web3';

import envConfig from '../../../core/env';
import logger from '../../../core/logger';
import { ChainConfig } from '../../../core/types';
import {
  ILendingProvider,
  LendingConfig,
  LendingPool,
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
  public async getPoolEvents(
    chainConfig: ChainConfig,
    poolConfig: LendingPool,
    fromBlock: number,
    toBlock: number
  ): Promise<Array<any>> {
    return [];
  }

  runAggregator(options: RunLendingAggregatorArgv): Promise<any> {
    return Promise.resolve(undefined);
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
          const events = await this.getPoolEvents(
            lendingConfig.chainConfig,
            lendingConfig.pools[i],
            startBlock,
            toBlock
          );
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
