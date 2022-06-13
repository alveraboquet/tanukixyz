import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import { Collection } from 'mongodb';

import envConfig from '../../../../core/env';
import { getTimestamp, getTodayUTCTimestamp } from '../../../../core/helper';
import logger from '../../../../core/logger';
import { GraphProvider } from '../../../../providers';
import { ModuleDatabaseIndex } from '../../constants';
import { AggregatorArgv, DexConfig, DexDateData, IDexProvider } from '../../types';

export class UniswapV2Provider implements IDexProvider {
  public readonly name: string = 'uniswapv2.provider';
  public readonly config: DexConfig;

  constructor(config: DexConfig) {
    this.config = config;

    // override provider name
    this.name = `${this.config.name}.provider`;
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      factory: 'uniswapFactories',
      totalFeeUSD: '', // uniswap v2 fee: volume * 0.3 / 100
      totalVolumeUSD: 'totalVolumeUSD',
      totalLiquidityUSD: 'totalLiquidityUSD',
      transactionCount: 'txCount',
    };
  }

  protected async summarizeDataInRange(graphEndpoint: string, fromBlock: number, toBlock: number): Promise<any> {
    const graphProvider = new GraphProvider();
    const metaBlock = await graphProvider.queryMetaLatestBlock(graphEndpoint);
    toBlock = toBlock > metaBlock ? metaBlock : toBlock;

    const filters: any = this.getFilters();

    const query: string = `
			{
				top: ${filters.factory}(block: {number: ${toBlock}}, first: 1) {
					${filters.totalVolumeUSD}
					${filters.totalLiquidityUSD}
					${filters.transactionCount}
					${filters.totalFeeUSD}
				}
				bottom: ${filters.factory}(block: {number: ${fromBlock}}, first: 1) {
					${filters.totalVolumeUSD}
					${filters.totalLiquidityUSD}
					${filters.transactionCount}
					${filters.totalFeeUSD}
				}
			}
		`;

    let queryResponse;
    try {
      queryResponse = await graphProvider.querySubgraph(graphEndpoint, query);
    } catch (e: any) {
      return null;
    }

    const data: any = {
      top: queryResponse.top[0],
      bottom: queryResponse.bottom[0],
    };

    if (data.top && data.bottom) {
      const dailyVolume = new BigNumber(data.top[filters.totalVolumeUSD])
        .minus(new BigNumber(data.bottom[filters.totalVolumeUSD]))
        .toNumber();
      const dailyFee =
        filters.totalFeeUSD !== ''
          ? new BigNumber(data.top[filters.totalFeeUSD])
              .minus(new BigNumber(data.bottom[filters.totalFeeUSD]))
              .toNumber()
          : (dailyVolume * 0.3) / 100;

      return {
        feeUSD: dailyFee,
        volumeUSD: dailyVolume,
        allTimeVolumeUSD: new BigNumber(data.top[filters.totalVolumeUSD]).toNumber(),
        transactionCount: new BigNumber(data.top[filters.transactionCount])
          .minus(new BigNumber(data.bottom[filters.transactionCount]))
          .toNumber(),
        liquidityUSD: new BigNumber(data.top[filters.totalLiquidityUSD]).toNumber(),
      };
    } else {
      return null;
    }
  }

  protected async getLast24HoursData(): Promise<DexDateData> {
    const graphProvider = new GraphProvider();
    const data: DexDateData = {
      module: ModuleDatabaseIndex,
      date: getTimestamp(),
      name: this.config.name,
      feeUSD: 0,
      volumeUSD: 0,
      allTimeVolumeUSD: 0,
      liquidityUSD: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < this.config.subgraph.length; i++) {
      // first, query the meta latest block number
      const metaLatestBlock: number = await graphProvider.queryMetaLatestBlock(this.config.subgraph[i].blocks);

      // second, query the block number at 24 hours before
      const last24HoursTimestamp = getTimestamp() - 24 * 60 * 60;
      const last24HoursBlock: number = await graphProvider.queryBlockAtTimestamp(
        this.config.subgraph[i].blocks,
        last24HoursTimestamp
      );

      const dailyData: any = await this.summarizeDataInRange(
        this.config.subgraph[i].exchange,
        last24HoursBlock,
        metaLatestBlock
      );
      if (dailyData) {
        data.feeUSD += dailyData.feeUSD;
        data.volumeUSD += dailyData.volumeUSD;
        data.allTimeVolumeUSD += dailyData.allTimeVolumeUSD;
        data.liquidityUSD += dailyData.liquidityUSD;
        data.transactionCount += dailyData.transactionCount;
      }
    }

    return data;
  }

  protected async getDataByDate(date: number): Promise<DexDateData> {
    const graphProvider = new GraphProvider();
    const data: DexDateData = {
      module: ModuleDatabaseIndex,
      date: date,
      name: this.config.name,
      feeUSD: 0,
      volumeUSD: 0,
      allTimeVolumeUSD: 0,
      liquidityUSD: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < this.config.subgraph.length; i++) {
      // first, query the end of the day block number
      const endDateBlock: number = await graphProvider.queryBlockAtTimestamp(
        this.config.subgraph[i].blocks,
        date + 24 * 60 * 60
      );

      // second, query the block number at start of the day
      const startDateBlock: number = await graphProvider.queryBlockAtTimestamp(this.config.subgraph[i].blocks, date);

      const dailyData: any = await this.summarizeDataInRange(
        this.config.subgraph[i].exchange,
        startDateBlock,
        endDateBlock
      );
      if (dailyData) {
        data.feeUSD += dailyData.feeUSD;
        data.volumeUSD += dailyData.volumeUSD;
        data.allTimeVolumeUSD += dailyData.allTimeVolumeUSD;
        data.liquidityUSD += dailyData.liquidityUSD;
        data.transactionCount += dailyData.transactionCount;
      }
    }

    return data;
  }

  public async getDailyData(): Promise<DexDateData> {
    return await this.getLast24HoursData();
  }

  public async getDateData(date: number): Promise<DexDateData> {
    return await this.getDataByDate(date);
  }

  public async runTest(): Promise<void> {
    const dailyData = await this.getDailyData();
    expect(dailyData.feeUSD).greaterThan(0);
    expect(dailyData.volumeUSD).greaterThan(0);
    expect(dailyData.allTimeVolumeUSD).greaterThan(0);
    expect(dailyData.liquidityUSD).greaterThan(0);
    expect(dailyData.transactionCount).greaterThan(0);

    const dateData = await this.getDateData(getTodayUTCTimestamp());
    expect(dateData.feeUSD).greaterThan(0);
    expect(dateData.volumeUSD).greaterThan(0);
    expect(dateData.allTimeVolumeUSD).greaterThan(0);
    expect(dateData.liquidityUSD).greaterThan(0);
    expect(dateData.transactionCount).greaterThan(0);

    console.log({
      name: this.config.name,
      dailyData: dailyData,
      dateData: dateData,
    });
  }

  public async runAggregator(argv: AggregatorArgv): Promise<void> {
    const { providers, initialDate, forceSync } = argv;

    try {
      // don't care anytime, update daily data
      const dailyData = await this.getDailyData();
      // get date data collection
      const dailyDataCollection: Collection = await providers.database.getCollection(
        envConfig.database.collections.globalDataDaily
      );
      await dailyDataCollection.updateOne(
        {
          module: ModuleDatabaseIndex,
          name: this.config.name,
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
          name: `dex:${this.config.name}`,
          volume: dailyData.volumeUSD,
          liquidity: dailyData.liquidityUSD,
        },
      });
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to update daily dex data, skipped',
        props: {
          name: `dex:${this.config.name}`,
        },
        error: e,
      });
    }

    // get date data collection
    const dateDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDate
    );

    let startDate = this.config.birthday;
    if (!forceSync) {
      // fetch latest date from database
      const documents = await dateDataCollection
        .find({
          module: ModuleDatabaseIndex,
          name: this.config.name,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (documents.length > 0) {
        startDate = documents[0].date;
      }
    } else {
      // force sync data from argv
      startDate = initialDate;
    }

    const today = getTodayUTCTimestamp();
    while (startDate <= today) {
      try {
        const dateData = await this.getDateData(startDate);
        await dateDataCollection.updateOne(
          {
            module: ModuleDatabaseIndex,
            name: this.config.name,
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
            name: `dex:${this.config.name}`,
            date: new Date(startDate * 1000).toISOString().split('T')[0],
            volume: dateData.volumeUSD,
            liquidity: dateData.liquidityUSD,
          },
        });
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed to update date dex data, skipped',
          props: {
            name: `dex:${this.config.name}`,
            date: new Date(startDate * 1000).toISOString().split('T')[0],
          },
          error: e,
        });
      }
      startDate += 24 * 60 * 60;
    }
  }
}
