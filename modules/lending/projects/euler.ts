import BigNumber from 'bignumber.js';
import { Collection } from 'mongodb';

import envConfig from '../../../core/env';
import { getTodayUTCTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { LendingConfig, LendingData, RunLendingAggregatorArgv, RunLendingCollectorArgv } from '../types';
import LendingProvider from './lending';

class EulerProvider extends LendingProvider {
  public readonly name: string = 'euler.provider';

  constructor(lendingConfig: LendingConfig) {
    super(lendingConfig);
  }

  public async getLiquidityLocked(props: LendingConfig): Promise<number> {
    return 0;
  }

  public async getPoolEvents(props: LendingConfig): Promise<Array<any>> {
    return [];
  }

  // euler provider sync data from subgraph
  // so, don't need to collect on-chain events
  public async runCollector(options: RunLendingCollectorArgv): Promise<any> {
    return null;
  }

  public async runAggregator(options: RunLendingAggregatorArgv): Promise<any> {
    const { providers, initialDate, forceSync } = options;

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.lendingEventSync);
    const dailyDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDaily
    );
    const dateDataCollection: Collection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDate
    );

    // firstly, we update daily data
    const dailyData: LendingData = {
      supplyVolumeUSD: 0,
      withdrawVolumeUSD: 0,
      borrowVolumeUSD: 0,
      repayVolumeUSD: 0,
      liquidityUSD: 0,
      addressCount: 0,
      transactionCount: 0,
    };

    // query daily data
    try {
      const metaBlock = await providers.subgraph.queryMetaLatestBlock(
        this.lendingConfig.configs[0].graphConfig?.lending as string
      );
      const query = `
				{
					deposit: dailyDeposits(first: 1, orderBy: timestamp, orderDirection: desc) {
						timestamp,
						count,
						totalAmount,
						totalUsdAmount,
					}
					withdraw: dailyWithdraws(first: 1, orderBy: timestamp, orderDirection: desc) {
						timestamp,
						count,
						totalAmount,
						totalUsdAmount,
					}
					borrow: dailyBorrows(first: 1, orderBy: timestamp, orderDirection: desc) {
						timestamp,
						count,
						totalAmount,
						totalUsdAmount,
					}
					repay: dailyRepays(first: 1, orderBy: timestamp, orderDirection: desc) {
						timestamp,
						count,
						totalAmount,
						totalUsdAmount,
					}
					overview: eulerOverviews(first: 1, block: {number: ${metaBlock}}) {
            totalBalancesUsd
          }
				}
			`;
      const response = await providers.subgraph.querySubgraph(
        this.lendingConfig.configs[0].graphConfig?.lending as string,
        query
      );
      dailyData.supplyVolumeUSD += new BigNumber(response['deposit'][0].totalUsdAmount).dividedBy(1e18).toNumber();
      dailyData.withdrawVolumeUSD += new BigNumber(response['withdraw'][0].totalUsdAmount).dividedBy(1e18).toNumber();
      dailyData.borrowVolumeUSD += new BigNumber(response['borrow'][0].totalUsdAmount).dividedBy(1e18).toNumber();
      dailyData.repayVolumeUSD += new BigNumber(response['repay'][0].totalUsdAmount).dividedBy(1e18).toNumber();

      // count transaction
      dailyData.transactionCount += Number(response['deposit'][0].count);
      dailyData.transactionCount += Number(response['withdraw'][0].count);
      dailyData.transactionCount += Number(response['borrow'][0].count);
      dailyData.transactionCount += Number(response['repay'][0].count);

      // count liquidity
      dailyData.liquidityUSD = new BigNumber(response['overview'][0].totalBalancesUsd).dividedBy(1e18).toNumber();

      await dailyDataCollection.updateOne(
        {
          module: 'lending',
          name: this.lendingConfig.name,
        },
        {
          $set: {
            module: 'lending',
            name: this.lendingConfig.name,
            ...dailyData,
          },
        },
        {
          upsert: true,
        }
      );

      logger.onInfo({
        source: this.name,
        message: 'updated lending daily data',
        props: {
          protocol: this.lendingConfig.name,
          volumeUSD:
            dailyData.supplyVolumeUSD +
            dailyData.borrowVolumeUSD +
            dailyData.borrowVolumeUSD +
            dailyData.repayVolumeUSD,
        },
      });
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to update daily data',
        props: {
          endpoint: this.lendingConfig.configs[0].graphConfig?.lending as string,
        },
        error: e.message,
      });
    }

    // secondly, update date data
    const today = getTodayUTCTimestamp();
    let startDate = initialDate === 0 ? this.lendingConfig.configs[0].birthday : initialDate;
    if (!forceSync) {
      const states = await dateDataCollection
        .find({
          module: 'lending',
          name: this.lendingConfig.name,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (states.length > 0) {
        startDate = states[0].date;
      }
    }

    while (startDate <= today) {
      const dateData: LendingData = {
        supplyVolumeUSD: 0,
        withdrawVolumeUSD: 0,
        borrowVolumeUSD: 0,
        repayVolumeUSD: 0,
        liquidityUSD: 0,
        addressCount: 0,
        transactionCount: 0,
      };

      // query date data
      const metaBlock = await providers.subgraph.queryMetaLatestBlock(
        this.lendingConfig.configs[0].graphConfig?.lending as string
      );
      const blockAtDate = await providers.subgraph.queryBlockAtTimestamp(
        this.lendingConfig.configs[0].chainConfig.blockSubgraph as string,
        startDate
      );
      const blockNumber = blockAtDate < metaBlock ? blockAtDate : metaBlock;

      try {
        const query = `
				{
					deposit: dailyDeposits(where: {timestamp: ${startDate}}) {
						count,
						totalUsdAmount,
					}
					withdraw: dailyWithdraws(where: {timestamp: ${startDate}}) {
						count,
						totalUsdAmount,
					}
					borrow: dailyBorrows(where: {timestamp: ${startDate}}) {
						count,
						totalUsdAmount,
					}
					repay: dailyRepays(where: {timestamp: ${startDate}}) {
						count,
						totalUsdAmount,
					}
					overview: eulerOverviews(first: 1, block: {number: ${blockNumber}}) {
            totalBalancesUsd
          }
				}
			`;
        const response = await providers.subgraph.querySubgraph(
          this.lendingConfig.configs[0].graphConfig?.lending as string,
          query
        );

        if (response['deposit'].length > 0) {
          dateData.supplyVolumeUSD += new BigNumber(response['deposit'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dateData.transactionCount += Number(response['deposit'][0].count);
        }
        if (response['withdraw'].length > 0) {
          dateData.withdrawVolumeUSD += new BigNumber(response['withdraw'][0].totalUsdAmount)
            .dividedBy(1e18)
            .toNumber();
          dateData.transactionCount += Number(response['withdraw'][0].count);
        }
        if (response['borrow'].length > 0) {
          dateData.borrowVolumeUSD += new BigNumber(response['borrow'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dateData.transactionCount += Number(response['borrow'][0].count);
        }
        if (response['repay'].length > 0) {
          dateData.repayVolumeUSD += new BigNumber(response['repay'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dateData.transactionCount += Number(response['repay'][0].count);
        }

        // count liquidity
        dateData.liquidityUSD = new BigNumber(response['overview'][0].totalBalancesUsd).dividedBy(1e18).toNumber();

        // save to db
        await dateDataCollection.updateOne(
          {
            module: 'lending',
            name: this.lendingConfig.name,
            date: startDate,
          },
          {
            $set: {
              module: 'lending',
              name: this.lendingConfig.name,
              date: startDate,
              ...dateData,
            },
          },
          {
            upsert: true,
          }
        );

        logger.onInfo({
          source: this.name,
          message: 'updated lending date data',
          props: {
            protocol: this.lendingConfig.name,
            date: new Date(startDate * 1000).toISOString().split('T')[0],
            volumeUSD:
              dateData.supplyVolumeUSD + dateData.borrowVolumeUSD + dateData.borrowVolumeUSD + dateData.repayVolumeUSD,
          },
        });
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed to update date data',
          props: {
            date: new Date(startDate * 1000).toISOString().split('T')[0],
            endpoint: this.lendingConfig.configs[0].graphConfig?.lending as string,
          },
          error: e.message,
        });
      }

      startDate += 24 * 60 * 60;
    }
  }
}

export default EulerProvider;
