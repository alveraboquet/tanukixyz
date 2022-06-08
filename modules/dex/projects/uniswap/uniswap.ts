import { Collection } from 'mongodb';

import envConfig from '../../../../core/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../../../core/helper';
import logger from '../../../../core/logger';
import { ModuleDatabaseIndex } from '../../constants';
import { DexDateData, IDexProvider } from '../../types';
import { UNISWAP_BIRTHDAY, UNISWAP_SUBGRAPH_V2, UNISWAP_SUBGRAPH_V3 } from './constants';
import { UniswapV2Provider } from './uniswapv2';
import { UniswapV3Provider } from './uniswapv3';

export class UniswapProvider implements IDexProvider {
  public readonly name: string = 'uniswap.provider';

  private providerV2: IDexProvider;
  private providerV3: IDexProvider;

  constructor() {
    this.providerV2 = new UniswapV2Provider({
      name: 'uniswap-v2',
      subgraph: UNISWAP_SUBGRAPH_V2,
      birthday: UNISWAP_BIRTHDAY,
    });
    this.providerV3 = new UniswapV3Provider({
      name: 'uniswap-v3',
      subgraph: UNISWAP_SUBGRAPH_V3,
      birthday: UNISWAP_BIRTHDAY,
    });
  }

  public async getDailyData(): Promise<DexDateData> {
    const v2Data = await this.providerV2.getDailyData();
    const v3Data = await this.providerV3.getDailyData();

    return {
      module: ModuleDatabaseIndex,
      date: getTimestamp(),
      name: 'uniswap',

      feeUSD: v2Data.feeUSD + v3Data.feeUSD,
      volumeUSD: v2Data.volumeUSD + v3Data.volumeUSD,
      allTimeVolumeUSD: v2Data.allTimeVolumeUSD + v3Data.allTimeVolumeUSD,
      liquidityUSD: v2Data.liquidityUSD + v3Data.liquidityUSD,
      transactionCount: v2Data.transactionCount + v3Data.transactionCount,
    };
  }

  public async getDateData(date: number): Promise<DexDateData> {
    const v2Data = await this.providerV2.getDateData(date);
    const v3Data = await this.providerV3.getDateData(date);

    return {
      module: ModuleDatabaseIndex,
      date: date,
      name: 'uniswap',

      feeUSD: v2Data.feeUSD + v3Data.feeUSD,
      volumeUSD: v2Data.volumeUSD + v3Data.volumeUSD,
      allTimeVolumeUSD: v2Data.allTimeVolumeUSD + v3Data.allTimeVolumeUSD,
      liquidityUSD: v2Data.liquidityUSD + v3Data.liquidityUSD,
      transactionCount: v2Data.transactionCount + v3Data.transactionCount,
    };
  }

  public async runTest(): Promise<void> {
    await this.providerV2.runTest();
    await this.providerV3.runTest();
  }

  public async runAggregator(argv: any): Promise<void> {
    const { providers, initialDate, forceSync } = argv;

    // don't care anytime, update daily data
    const dailyData = await this.getDailyData();
    // get date data collection
    const dailyDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDaily
    );
    await dailyDataCollection.updateOne(
      {
        module: ModuleDatabaseIndex,
        name: 'uniswap',
      },
      {
        $set: {
          ...dailyData,
        },
      },
      {
        upsert: true,
      }
    );

    // log because i'm a bad dev
    logger.onInfo({
      source: this.name,
      message: 'updated daily data',
      props: {
        name: 'dex:uniswap',
        volume: dailyData.volumeUSD,
        liquidity: dailyData.liquidityUSD,
      },
    });

    // get date data collection
    const dateDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDate
    );

    let startDate = UNISWAP_BIRTHDAY;
    if (!forceSync) {
      // fetch latest date from database
      const documents = await dateDataCollection
        .find({
          module: ModuleDatabaseIndex,
          name: 'uniswap',
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (documents.length > 0) {
        startDate = documents[0].date;
      }
    } else {
      startDate = initialDate;
    }

    const today = getTodayUTCTimestamp();
    while (startDate <= today) {
      const dateData = await this.getDateData(startDate);
      await dateDataCollection.updateOne(
        {
          module: ModuleDatabaseIndex,
          name: 'uniswap',
          date: startDate,
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

      logger.onInfo({
        source: this.name,
        message: 'updated date data',
        props: {
          name: 'dex:uniswap',
          date: new Date(startDate * 1000).toISOString().split('T')[0],
          volume: dateData.volumeUSD,
          liquidity: dateData.liquidityUSD,
        },
      });

      startDate += 24 * 60 * 60;
    }
  }
}
