import { DefiProtocolModuleCode, InitialSyncDate } from '../../configs';
import envConfig from '../../configs/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../lib/helper';
import logger from '../../lib/logger';
import { Provider, ShareProviders } from '../../lib/types';
import TokenomicsProvider from './tokenomics';
import { ProtocolData } from './types';

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

  constructor(configs: any) {
    this.configs = configs;
  }

  // override this function
  getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async getDailyData(argv: GetProtocolDataProps): Promise<ProtocolData> {
    const { providers, date } = argv;

    const data = await this.getDataInTimeFrame(providers, date - 24 * 60 * 60, date);
    const data24 = await this.getDataInTimeFrame(providers, date - 48 * 60 * 60, date - 24 * 60 * 60);

    return {
      ...data,
      changes24Hours: {
        volumeInUseUSD: ((data.volumeInUseUSD - data24.volumeInUseUSD) / data24.volumeInUseUSD) * 100,
        transactionCount: ((data.transactionCount - data24.transactionCount) / data24.transactionCount) * 100,
        feeUSD: ((data.feeUSD - data24.feeUSD) / data24.feeUSD) * 100,
        userCount: ((data.userCount - data24.userCount) / data24.userCount) * 100,
        totalValueLockedUSD:
          ((data.totalValueLockedUSD - data24.totalValueLockedUSD) / data24.totalValueLockedUSD) * 100,
      },
    };
  }

  public async getDateData(argv: GetProtocolDataProps): Promise<any> {
    const { providers, date } = argv;
    return await this.getDataInTimeFrame(providers, date, date + 24 * 60 * 60);
  }

  public async start(props: StartCollectorServiceProps): Promise<void> {
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
        feeUSD: dailyData.feeUSD.toFixed(2),
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
          feeUSD: dateData.feeUSD.toFixed(2),
          tvlUSD: dateData.totalValueLockedUSD.toFixed(2),
          volumeUSD: dateData.volumeInUseUSD.toFixed(2),
          elapsed: `${elapsed}s`,
        },
      });

      startDate += 24 * 60 * 60;
    }
  }
}
