import { DefiProtocolModuleCode, InitialSyncDate } from '../../../configs';
import envConfig from '../../../configs/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { Provider, ShareProviders } from '../../../lib/types';
import { ProtocolData } from '../types';
import { CollectorHook } from './hook';
import TokenomicsProvider from './tokenomics';

export interface GetProtocolDataProps {
  date: number;
  providers: ShareProviders;
}

export interface StartCollectorServiceProps {
  initialDate: number;
  forceSync: boolean;
  providers: ShareProviders;
}

export class CollectorProvider implements Provider {
  public readonly name: string = 'module.collector';
  public readonly configs: any;
  public hook: CollectorHook | null;

  constructor(configs: any, hook: CollectorHook | null) {
    this.configs = configs;
    this.hook = hook;
  }

  // override this function
  getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async getDailyData(argv: GetProtocolDataProps): Promise<ProtocolData> {
    const { providers, date } = argv;

    // last 24 hours
    const last24HoursTimestamp = date - 24 * 60 * 60;
    const last48HoursTimestamp = date - 48 * 60 * 60;

    const last24HoursData = await this.getDataInTimeFrame(providers, last24HoursTimestamp, date);
    const last48HoursData = await this.getDataInTimeFrame(providers, last48HoursTimestamp, last24HoursTimestamp);

    const data: ProtocolData = {
      revenueUSD: last24HoursData.revenueUSD,
      volumeInUseUSD: last24HoursData.volumeInUseUSD,
      totalValueLockedUSD: last24HoursData.totalValueLockedUSD,
      userCount: last24HoursData.userCount,
      transactionCount: last24HoursData.transactionCount,

      changes: {
        revenueChangePercentage:
          ((last24HoursData.revenueUSD - last48HoursData.revenueUSD) / last48HoursData.revenueUSD) * 100,
        volumeInUseChangePercentage:
          ((last24HoursData.volumeInUseUSD - last48HoursData.volumeInUseUSD) / last48HoursData.volumeInUseUSD) * 100,
        totalValueLockedChangePercentage:
          ((last24HoursData.totalValueLockedUSD - last48HoursData.totalValueLockedUSD) /
            last48HoursData.totalValueLockedUSD) *
          100,
        userCountChangePercentage:
          ((last24HoursData.userCount - last48HoursData.userCount) / last48HoursData.userCount) * 100,
        transactionCountChangePercentage:
          ((last24HoursData.transactionCount - last48HoursData.transactionCount) / last48HoursData.transactionCount) *
          100,
      },
    };

    // call hooks
    if (this.hook) {
      const hookData: any = await this.hook.getHookData({ providers, date });
      data.badDebtUSD = hookData.badDebtUSD;
      data.insolventUserCount = hookData.insolventUserCount;
    }

    return data;
  }

  public async getDateData(argv: GetProtocolDataProps): Promise<any> {
    const { providers, date } = argv;
    return await this.getDataInTimeFrame(providers, date, date + 24 * 60 * 60);
  }

  public async start(props: StartCollectorServiceProps): Promise<any> {
    const { initialDate, forceSync, providers } = props;

    // collect daily data
    const startExeTime = new Date().getTime();
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
    const endExeTime = new Date().getTime();
    const elapsed = (endExeTime - startExeTime) / 1000;
    logger.onInfo({
      source: this.name,
      message: 'collected protocol daily data',
      props: {
        protocol: this.configs.name,
        revenueUSD: dailyData.revenueUSD.toFixed(2),
        tvlUSD: dailyData.totalValueLockedUSD.toFixed(2),
        volumeUSD: dailyData.volumeInUseUSD.toFixed(2),
        userCount: dailyData.userCount.toFixed(2),
        txnCount: dailyData.transactionCount.toFixed(2),
        elapsed: `${elapsed.toFixed(2)}s`,
      },
    });

    // start to collect date data
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
