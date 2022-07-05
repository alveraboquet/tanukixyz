import { DefiProtocolModuleCode, InitialSyncDate } from '../../../configs';
import envConfig from '../../../configs/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { ShareProviders } from '../../../lib/types';
import { ICollectorProvider, ProtocolData } from '../types';
import TokenomicsProvider from './tokenomics';

export interface GetProtocolDataProps {
  date: number;
  providers: ShareProviders;
}

export enum StartCollectorServiceMode {
  DAILY,
  DATE,
}

export interface StartCollectorServiceProps {
  mode: StartCollectorServiceMode;
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

  getDailyData(argv: GetProtocolDataProps): Promise<any> {
    return Promise.resolve(undefined);
  }

  getDateData(argv: GetProtocolDataProps): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async startService(props: StartCollectorServiceProps): Promise<any> {
    const { mode, initialDate, forceSync, providers } = props;

    if (mode === StartCollectorServiceMode.DAILY) {
      const dailyCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDaily);
      // update daily data
      const currentTimestamp = getTimestamp();
      const dailyData: ProtocolData = await this.getDailyData({
        providers,
        date: currentTimestamp,
      });
      // get tokenomics
      if (this.configs.tokenomics) {
        const tokenomicsProvider = new TokenomicsProvider(this.configs.tokenomics);
        dailyData.tokenomics = await tokenomicsProvider.getTokenomicsStats(currentTimestamp);
      }
      await dailyCollection.updateOne(
        {
          module: DefiProtocolModuleCode,
          name: this.configs.name,
        },
        {
          $set: {
            module: DefiProtocolModuleCode,
            name: this.configs.name,
            timestamp: currentTimestamp,
            ...dailyData,
          },
        },
        {
          upsert: true,
        }
      );
      logger.onInfo({
        source: this.name,
        message: 'collected protocol daily data',
        props: {
          protocol: this.configs.name,
          revenueUSD: dailyData.revenueUSD.toFixed(2),
          tvlUSD: dailyData.totalValueLockedUSD.toFixed(2),
          volumeUSD: dailyData.volumeInUseUSD.toFixed(2),
        },
      });
    } else {
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
        const dateData: ProtocolData = await this.getDateData({
          providers: providers,
          date: startDate,
        });

        // get tokenomics
        if (this.configs.tokenomics) {
          const tokenomicsProvider = new TokenomicsProvider(this.configs.tokenomics);
          dateData.tokenomics = await tokenomicsProvider.getTokenomicsStats(startDate);
        }

        // save to database
        await dateCollection.updateOne(
          {
            module: DefiProtocolModuleCode,
            name: this.configs.name,
            date: startDate,
          },
          {
            $set: {
              module: DefiProtocolModuleCode,
              name: this.configs.name,
              date: startDate,
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
}

export default CollectorProvider;
