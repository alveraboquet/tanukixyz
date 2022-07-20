import { InitialSyncDate } from '../../../configs';
import envConfig from '../../../configs/env';
import { RegistryProtocolConfig } from '../../../configs/types';
import { getTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { Provider, RegistryAddressData, ShareProviders } from '../../../lib/types';

export interface StartRegistryServiceProps {
  providers: ShareProviders;
  forceSync: boolean;
}

export interface GetAddressSnapshotProps {
  providers: ShareProviders;
  timestamp: number;
}

class RegistryProvider implements Provider {
  public readonly name: string = 'provider.registry';

  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  public async getAddressInfo(providers: ShareProviders): Promise<Array<RegistryAddressData>> {
    return await this.getAddressSnapshot({ providers, timestamp: getTimestamp() });
  }

  public async getAddressSnapshot(props: GetAddressSnapshotProps): Promise<Array<RegistryAddressData>> {
    return [];
  }

  private async _syncCurrentInfo(props: StartRegistryServiceProps): Promise<void> {
    const { providers } = props;

    const startExeTime = new Date().getTime();

    logger.onInfo({
      source: this.name,
      message: 'collecting address latest data',
      props: {
        name: (this.configs as RegistryProtocolConfig).name,
      },
    });

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );

    const addresses: Array<RegistryAddressData> = await this.getAddressInfo(providers);

    const operations: Array<any> = [];
    for (let i = 0; i < addresses.length; i++) {
      operations.push({
        updateOne: {
          filter: {
            chain: addresses[i].chain,
            address: addresses[i].address,
            protocol: addresses[i].protocol,
          },
          update: {
            $set: {
              ...addresses[i],
            },
          },
          upsert: true,
        },
      });
    }

    if (operations.length > 0) {
      await addressRegistryCollection.bulkWrite(operations);
    }

    const endExeTime = new Date().getTime();
    const elapsed = (endExeTime - startExeTime) / 1000;
    logger.onInfo({
      source: this.name,
      message: `collected ${operations.length} addresses latest data`,
      props: {
        name: this.configs.name,
        elapsed: `${elapsed.toFixed(2)}s`,
      },
    });
  }

  private async _syncSnapshotInfo(props: StartRegistryServiceProps): Promise<void> {
    const { providers, forceSync } = props;

    const stateCollection = await providers.database.getCollection(envConfig.database.collections.globalState);
    const addressSnapshotCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddressSnapshot
    );

    let startDate = InitialSyncDate;
    if (!forceSync) {
      const latestSyncData = await stateCollection
        .find({
          name: `registry-address-${this.configs.name}`,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (latestSyncData.length > 0) {
        startDate = latestSyncData[0].timestamp > startDate ? latestSyncData[0].timestamp : startDate;
      }
    }

    logger.onInfo({
      source: this.name,
      message: 'collecting address snapshot data',
      props: {
        name: (this.configs as RegistryProtocolConfig).name,
        fromTime: startDate,
      },
    });

    const currentTimestamp = getTimestamp();
    while (startDate <= currentTimestamp) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);

      const addresses: Array<RegistryAddressData> = await this.getAddressSnapshot({ providers, timestamp: startDate });

      const operations: Array<any> = [];
      for (let i = 0; i < addresses.length; i++) {
        operations.push({
          updateOne: {
            filter: {
              chain: addresses[i].chain,
              address: addresses[i].address,
              protocol: addresses[i].protocol,
              timestamp: addresses[i].timestamp,
            },
            update: {
              $set: {
                ...addresses[i],
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await addressSnapshotCollection.bulkWrite(operations);
      }

      await stateCollection.updateOne(
        {
          name: `registry-address-${this.configs.name}`,
        },
        {
          $set: {
            name: `registry-address-${this.configs.name}`,
            timestamp: startDate,
          },
        },
        { upsert: true }
      );

      const endExeTime = new Date().getTime();
      const elapsed = (endExeTime - startExeTime) / 1000;
      logger.onInfo({
        source: this.name,
        message: `collected ${operations.length} addresses snapshot data`,
        props: {
          name: this.configs.name,
          timestamp: startDate,
          elapsed: `${elapsed.toFixed(2)}s`,
        },
      });

      startDate += 24 * 60 * 60;
    }
  }

  public async startService(props: StartRegistryServiceProps): Promise<void> {
    await this._syncCurrentInfo(props);
    await this._syncSnapshotInfo(props);
  }
}

export default RegistryProvider;
