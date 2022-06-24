import Web3 from 'web3';

import envConfig from '../../core/env';
import { normalizeAddress } from '../../core/helper';
import logger from '../../core/logger';
import { Provider } from '../../core/namespaces';
import { ShareProviders } from '../../core/types';
import { EventRawData, IndexConfig } from './types';

export interface StartEventIndexerProps {}
export interface GetEventsProps {
  fromBlock: number;
  toBlock: number;
}

export class EventIndexerProvider implements Provider {
  public readonly name: string = 'provider.indexer';
  public readonly providers: ShareProviders;
  public readonly config: IndexConfig;

  constructor(providers: ShareProviders, config: IndexConfig) {
    this.providers = providers;
    this.config = config;
  }

  public async getEvents(props: GetEventsProps): Promise<Array<EventRawData>> {
    const { fromBlock, toBlock } = props;

    let beautyEvents: Array<any> = [];
    for (let eventIdx = 0; eventIdx < this.config.events.length; eventIdx++) {
      beautyEvents = beautyEvents.concat(
        await EventIndexerProvider.getEvent(this.config.events[eventIdx], this.config, fromBlock, toBlock)
      );
    }

    return beautyEvents;
  }

  public async start(props: StartEventIndexerProps): Promise<void> {
    const eventCollection = await this.providers.database.getCollection(
      envConfig.database.collections.globalContractEvents
    );

    let startBlock = this.config.contractBirthday;
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

    const web3 = new Web3(this.config.chainConfig.nodeRpcs.default);
    const currentBlockNumber = await web3.eth.getBlockNumber();
    while (startBlock <= currentBlockNumber) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);
      const toBlock = startBlock + 2000 > currentBlockNumber ? currentBlockNumber : startBlock + 2000;
      const eventRawData: Array<EventRawData> = await this.getEvents({
        fromBlock: startBlock,
        toBlock,
      });
      const operations: Array<any> = [];
      for (let i = 0; i < eventRawData.length; i++) {
        operations.push({
          updateOne: {
            filter: {
              contract: normalizeAddress(this.config.contractAddress),
              event: eventRawData[i].event,
              transactionId: eventRawData[i].transactionId,
            },
            update: {
              $set: {
                ...eventRawData[i],
              },
            },
            upsert: true,
          },
        });
      }
      if (operations.length > 0) {
        await eventCollection.bulkWrite(operations);
      }

      const endExeTime = Math.floor(new Date().getTime() / 1000);
      const elapsed = endExeTime - startExeTime;

      logger.onInfo({
        source: this.name,
        message: 'collected contract events',
        props: {
          contract: normalizeAddress(this.config.contractAddress),
          events: operations.length,
          fromBlock: startBlock,
          toBlock: toBlock,
          elapsed: `${elapsed}s`,
        },
      });

      startBlock += 2000;
    }
  }

  private static async getEvent(
    event: string,
    config: IndexConfig,
    fromBlock: number,
    toBlock: number
  ): Promise<Array<EventRawData>> {
    const web3 = new Web3(config.chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(config.contractAbi, config.contractAddress);

    try {
      const events = await contract.getPastEvents(event, { fromBlock, toBlock });

      const blockTimestamps: any = {};
      const beautyEvents: Array<EventRawData> = [];
      for (let i = 0; i < events.length; i++) {
        let timestamp = blockTimestamps[events[i].blockNumber];
        if (timestamp === undefined) {
          const block = await web3.eth.getBlock(events[i].blockNumber, false);
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
          contract: normalizeAddress(config.contractAddress),
          fromBlock: fromBlock,
          toBlock: toBlock,
        },
      });
      return [];
    }
  }
}
