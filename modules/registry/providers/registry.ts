import envConfig from '../../../configs/env';
import { RegistryProtocolConfig } from '../../../configs/types';
import { getTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { RegistryTransactionData, ShareProviders } from '../../../lib/types';
import { IRegistryProvider } from '../types';

export interface StartRegistryServiceProps {
  initialTime: number;
  forceSync: boolean;
  providers: ShareProviders;
}

class RegistryProvider implements IRegistryProvider {
  public readonly name: string = 'provider.registry';

  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  public async getTransactionInTimeFrame(
    providers: ShareProviders,
    fromTime: number,
    toTime: number
  ): Promise<Array<RegistryTransactionData>> {
    return [];
  }

  public async startService(props: StartRegistryServiceProps): Promise<void> {
    const { initialTime, forceSync, providers } = props;

    const stateCollection = await providers.database.getCollection(envConfig.database.collections.globalState);
    const transactionRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryTransactions
    );

    // for every protocol, we default collect data from the beginning
    // but if initialTime and forceSync were set, we will collect data from there
    let startTime = 1609459200; // Fri Jan 01 2021 00:00:00 GMT+0000
    if (initialTime && forceSync) {
      startTime = initialTime;
    } else {
      // we check last time in database and start from there
      const states = await stateCollection
        .find({
          name: `registry-${(this.configs as RegistryProtocolConfig).name}`,
        })
        .limit(1)
        .toArray();
      if (states.length > 0) {
        startTime = states[0].timestamp;
      }
    }

    logger.onInfo({
      source: this.name,
      message: 'start collect registry data',
      props: {
        name: (this.configs as RegistryProtocolConfig).name,
        startTime: startTime,
      },
    });

    // timeframe to query
    const queryTimeframe = 60 * 60;

    const currentTime = getTimestamp();
    while (startTime <= currentTime) {
      const transactions: Array<RegistryTransactionData> = await this.getTransactionInTimeFrame(
        providers,
        startTime,
        startTime + queryTimeframe
      );

      const operations: Array<any> = [];
      for (let txIdx = 0; txIdx < transactions.length; txIdx++) {
        operations.push({
          updateOne: {
            filter: {
              protocol: transactions[txIdx].protocol,
              chain: transactions[txIdx].chain,
              transactionHash: transactions[txIdx].transactionHash,
            },
            update: {
              $set: {
                ...transactions[txIdx],
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await transactionRegistryCollection.bulkWrite(operations);
      }

      await stateCollection.updateOne(
        {
          name: `registry-${(this.configs as RegistryProtocolConfig).name}`,
        },
        {
          $set: {
            name: `registry-${(this.configs as RegistryProtocolConfig).name}`,
            timestamp: startTime + queryTimeframe > currentTime ? currentTime : startTime + queryTimeframe,
          },
        },
        {
          upsert: true,
        }
      );

      logger.onInfo({
        source: this.name,
        message: `collected ${operations.length} registry transactions`,
        props: {
          name: this.configs.name,
          timestamp: startTime + queryTimeframe,
        },
      });

      startTime += queryTimeframe;
    }
  }
}

export default RegistryProvider;
