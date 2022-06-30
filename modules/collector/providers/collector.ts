import { DefiProtocolModuleCode, InitialSyncDate } from '../../../configs';
import envConfig from '../../../configs/env';
import { getTodayUTCTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { ShareProviders } from '../../../lib/types';
import { ICollectorProvider, ProtocolDateData } from '../types';

export interface GetProtocolDateDataProps {
  date: number;
  providers: ShareProviders;
}

export interface StartCollectorServiceProps {
  initialDate: number;
  forceSync: boolean;
  providers: ShareProviders;
}

class CollectorProvider implements ICollectorProvider {
  public readonly name: string = 'provider.collector';
  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  getDateData(argv: GetProtocolDateDataProps): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async startService(props: StartCollectorServiceProps): Promise<any> {
    const { initialDate, forceSync, providers } = props;

    const dateCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    let startDate = InitialSyncDate;
    if (forceSync) {
      startDate = initialDate;
    } else {
      const latestSyncData = await dateCollection
        .find({
          module: DefiProtocolModuleCode,
          name: this.configs.name,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (latestSyncData.length > 0) {
        startDate = latestSyncData[0].date > startDate ? latestSyncData[0].date : startDate;
      }
    }

    const today = getTodayUTCTimestamp();
    while (startDate <= today) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);
      const dateData: ProtocolDateData = await this.getDateData({
        providers: providers,
        date: startDate,
      });
      // make sure use the right module code
      dateData.module = DefiProtocolModuleCode;

      // save to database
      await dateCollection.updateOne(
        {
          module: DefiProtocolModuleCode,
          name: this.configs.name,
          date: dateData.date,
        },
        {
          $set: {
            ...dateData,
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
        message: 'collected protocol date data',
        props: {
          protocol: this.configs.name,
          date: new Date(startDate * 1000).toISOString().split('T')[0],
          revenueUSD: dateData.revenueUSD.toFixed(2),
          tvlUSD: dateData.totalValueLockedUSD.toFixed(2),
          volumeUSD: dateData.volumeInUseUSD.toFixed(2),
          elapsed: `${elapsed}s`,
        },
      });

      startDate += 24 * 60 * 60;
    }
  }
}

export default CollectorProvider;
