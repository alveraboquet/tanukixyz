import Web3 from 'web3';

import envConfig from '../../configs/env';
import { EventIndexConfig } from '../../configs/types';
import { normalizeAddress } from '../../lib/helper';
import logger from '../../lib/logger';
import { ContractEventRawData } from '../../lib/types';
import { Provider, ShareProviders } from '../../lib/types';
import IndexerHook from './hooks/hook';

export interface StartEventIndexerProps {
  initialBlock: number;
  forceSync: boolean;
}

export interface GetEventsProps {
  fromBlock: number;
  toBlock: number;
}

export class EventIndexerProvider implements Provider {
  public readonly name: string = 'provider.indexer';
  public readonly providers: ShareProviders;
  public readonly config: EventIndexConfig;

  // special hook, additional steps to process the event data
  public readonly hook: IndexerHook | null;

  constructor(providers: ShareProviders, config: EventIndexConfig, hook: IndexerHook | null) {
    this.providers = providers;
    this.config = config;
    this.hook = hook;
  }

  public async getEvents(props: GetEventsProps): Promise<Array<ContractEventRawData>> {
    const { fromBlock, toBlock } = props;

    let beautyEvents: Array<any> = [];
    for (let eventIdx = 0; eventIdx < this.config.events.length; eventIdx++) {
      beautyEvents = beautyEvents.concat(
        await this.getEvent(this.config.events[eventIdx], this.config, fromBlock, toBlock)
      );
    }

    return beautyEvents;
  }

  public async start(props: StartEventIndexerProps): Promise<void> {
    const { initialBlock, forceSync } = props;

    const eventCollection = await this.providers.database.getCollection(
      envConfig.database.collections.globalContractEvents
    );
    const stateCollection = await this.providers.database.getCollection(envConfig.database.collections.globalState);

    let startBlock = initialBlock !== 0 ? initialBlock : this.config.contractBirthday;
    if (!forceSync) {
      const stateFromDb = await stateCollection
        .find({
          name: `indexer-events-${this.config.chainConfig.name}-${normalizeAddress(this.config.contractAddress)}`,
        })
        .limit(1)
        .toArray();
      if (stateFromDb.length > 0) {
        startBlock = startBlock > stateFromDb[0].blockNumber ? startBlock : stateFromDb[0].blockNumber;
      } else {
        const latestEventsFromDb = await eventCollection
          .find({
            contract: normalizeAddress(this.config.contractAddress),
          })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();
        if (latestEventsFromDb.length > 0) {
          startBlock = startBlock > latestEventsFromDb[0].blockNumber ? startBlock : latestEventsFromDb[0].blockNumber;
        }
      }
    }

    const web3 = new Web3(this.config.chainConfig.nodeRpcs.default);
    const currentBlockNumber = await web3.eth.getBlockNumber();
    while (startBlock <= currentBlockNumber) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);
      const toBlock = startBlock + 2000 > currentBlockNumber ? currentBlockNumber : startBlock + 2000;
      const allEvents: Array<ContractEventRawData> = await this.getEvents({
        fromBlock: startBlock,
        toBlock,
      });
      const operations: Array<any> = [];
      for (let i = 0; i < allEvents.length; i++) {
        operations.push({
          updateOne: {
            filter: {
              contract: normalizeAddress(this.config.contractAddress),
              event: allEvents[i].event,
              transactionId: allEvents[i].transactionId,
            },
            update: {
              $set: {
                ...allEvents[i],
              },
            },
            upsert: true,
          },
        });
      }
      if (operations.length > 0) {
        await eventCollection.bulkWrite(operations);
      }

      // save state to db, ignore if force sync
      if (!forceSync) {
        await stateCollection.updateOne(
          {
            name: `indexer-events-${this.config.chainConfig.name}-${normalizeAddress(this.config.contractAddress)}`,
          },
          {
            $set: {
              name: `indexer-events-${this.config.chainConfig.name}-${normalizeAddress(this.config.contractAddress)}`,
              blockNumber: toBlock,
            },
          },
          {
            upsert: true,
          }
        );
      }

      // pass events to hook for addition steps
      if (this.hook) {
        await this.hook.processEvents(allEvents);
      }

      const endExeTime = Math.floor(new Date().getTime() / 1000);
      const elapsed = endExeTime - startExeTime;

      logger.onInfo({
        source: this.name,
        message: `collected ${operations.length} contract events`,
        props: {
          chain: this.config.chainConfig.name,
          contract: normalizeAddress(this.config.contractAddress),
          fromBlock: startBlock,
          toBlock: toBlock,
          elapsed: `${elapsed}s`,
        },
      });

      startBlock += 2000;
    }
  }

  private async getEvent(
    event: string,
    config: EventIndexConfig,
    fromBlock: number,
    toBlock: number
  ): Promise<Array<ContractEventRawData>> {
    const web3 = new Web3(config.chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(config.contractAbi, config.contractAddress);

    try {
      const events = await contract.getPastEvents(event, { fromBlock, toBlock });

      const blockTimestamps: any = {};
      const beautyEvents: Array<ContractEventRawData> = [];
      for (let i = 0; i < events.length; i++) {
        let timestamp = blockTimestamps[events[i].blockNumber];
        if (timestamp === undefined) {
          const block = await web3.eth.getBlock(Number(events[i].blockNumber), false);
          if (block === null) {
            logger.onDebug({
              source: this.name,
              message: 'failed to get block data',
              props: {
                chain: config.chainConfig.name,
                blockNumber: events[i].blockNumber,
              },
            });
            continue;
          }
          blockTimestamps[events[i].blockNumber] = block.timestamp;
          timestamp = block.timestamp;
        }

        beautyEvents.push({
          chain: config.chainConfig.name,
          blockNumber: events[i].blockNumber,
          timestamp: timestamp,
          transactionId: `${events[i].transactionHash}:${events[i].logIndex}`,
          contract: normalizeAddress(config.contractAddress),
          event: event,
          returnValues: events[i].returnValues,
        });
      }

      return beautyEvents;
    } catch (e: any) {
      logger.onDebug({
        source: this.name,
        message: 'failed to get contract events, skipped',
        props: {
          chain: config.chainConfig.name,
          contract: normalizeAddress(config.contractAddress),
          fromBlock: fromBlock,
          toBlock: toBlock,
          error: e.message,
        },
      });
      return [];
    }
  }
}
