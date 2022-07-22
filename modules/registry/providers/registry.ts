import { InitialSyncDate } from '../../../configs';
import envConfig from '../../../configs/env';
import { RegistryProtocolConfig } from '../../../configs/types';
import { getTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { Provider, ShareProviders } from '../../../lib/types';

export interface StartRegistryServiceProps {
  providers: ShareProviders;
  forceSync: boolean;
}

export interface GetAddressSnapshotProps {
  providers: ShareProviders;
  timestamp: number;
  snapshot: boolean;
}

class RegistryProvider implements Provider {
  public readonly name: string = 'provider.registry';

  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  public async syncSnapshotAddressData(props: GetAddressSnapshotProps): Promise<void> {}

  private async _syncCurrentInfo(props: StartRegistryServiceProps): Promise<void> {
    const { providers } = props;

    logger.onInfo({
      source: this.name,
      message: 'collecting address latest data',
      props: {
        name: (this.configs as RegistryProtocolConfig).name,
      },
    });

    await this.syncSnapshotAddressData({ providers, timestamp: getTimestamp(), snapshot: false });
  }

  // private async _syncSnapshotInfo(props: StartRegistryServiceProps): Promise<void> {
  //   const { providers, forceSync } = props;
  //
  //   const stateCollection = await providers.database.getCollection(envConfig.database.collections.globalState);
  //
  //   let startDate = InitialSyncDate;
  //   if (!forceSync) {
  //     const latestSyncData = await stateCollection
  //       .find({
  //         name: `registry-address-${this.configs.name}`,
  //       })
  //       .sort({ date: -1 })
  //       .limit(1)
  //       .toArray();
  //     if (latestSyncData.length > 0) {
  //       startDate = latestSyncData[0].timestamp > startDate ? latestSyncData[0].timestamp : startDate;
  //     }
  //   }
  //
  //   logger.onInfo({
  //     source: this.name,
  //     message: 'collecting address snapshot data',
  //     props: {
  //       name: (this.configs as RegistryProtocolConfig).name,
  //       fromTime: startDate,
  //     },
  //   });
  //
  //   const currentTimestamp = getTimestamp();
  //   while (startDate <= currentTimestamp) {
  //     await this.syncSnapshotAddressData({ providers, timestamp: startDate, snapshot: true });
  //
  //     await stateCollection.updateOne(
  //       {
  //         name: `registry-address-${this.configs.name}`,
  //       },
  //       {
  //         $set: {
  //           name: `registry-address-${this.configs.name}`,
  //           timestamp: startDate,
  //         },
  //       },
  //       { upsert: true }
  //     );
  //
  //     startDate += 24 * 60 * 60;
  //   }
  // }

  public async startService(props: StartRegistryServiceProps): Promise<void> {
    await this._syncCurrentInfo(props);
    // await this._syncSnapshotInfo(props);
  }
}

export default RegistryProvider;
