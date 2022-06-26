import envConfig from '../../../core/env';
import { getTodayUTCTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { ShareProviders } from '../../../core/types';
import { DefiDateData, IDefiProvider } from '../types';

export interface GetDefiDateDataProps {
  date: number;
  providers: ShareProviders;
}

export interface StartDefiServiceProps {
  initialDate: number;
  forceSync: boolean;
  providers: ShareProviders;
}

export const InitialSyncDate = 1640995200; // Sat Jan 01 2022 00:00:00 GMT+0000

class DefiProvider implements IDefiProvider {
  public readonly name: string = 'provider.defi';
  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  getDateData(argv: GetDefiDateDataProps): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async startService(props: StartDefiServiceProps): Promise<any> {
    const { initialDate, forceSync, providers } = props;

    const dateCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    let startDate = InitialSyncDate;
    if (forceSync) {
      startDate = initialDate;
    } else {
      const latestSyncData = await dateCollection
        .find({
          module: 'defi',
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
      const dateData: DefiDateData = await this.getDateData({
        providers: providers,
        date: startDate,
      });

      // save to database
      await dateCollection.updateOne(
        {
          module: 'defi',
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
        message: 'collected defi date data',
        props: {
          name: this.configs.name,
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

export default DefiProvider;
