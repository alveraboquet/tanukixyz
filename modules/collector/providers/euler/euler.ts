import BigNumber from 'bignumber.js';

import { EulerProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

class EulerProvider extends CollectorProvider {
  public readonly name: string = 'provider.euler';

  constructor(configs: EulerProtocolConfig) {
    super(configs);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { date, providers } = props;
    let fromTime = date - 24 * 60 * 60;

    const dailyData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    // query date data
    const metaBlock = await providers.subgraph.queryMetaLatestBlock(this.configs.graphEndpoint);
    const blockAtDate = await providers.subgraph.queryBlockAtTimestamp(
      this.configs.chainConfig.subgraph.blockSubgraph as string,
      date
    );
    const blockNumber = blockAtDate < metaBlock ? blockAtDate : metaBlock;

    while (fromTime < date) {
      try {
        const query = `
				{
					deposit: hourlyDeposits(where: {timestamp_gte: ${fromTime}}) {
						count,
						totalUsdAmount,
					}
					withdraw: hourlyWithdraws(where: {timestamp_gte: ${fromTime}}) {
						count,
						totalUsdAmount,
					}
					borrow: hourlyBorrows(where: {timestamp_gte: ${date}}) {
						count,
						totalUsdAmount,
					}
					repay: hourlyRepays(where: {timestamp_gte: ${date}}) {
						count,
						totalUsdAmount,
					}
					overview: eulerOverviews(first: 1, block: {number: ${blockNumber}}) {
            totalBalancesUsd
          }
				}
			`;
        const response = await providers.subgraph.querySubgraph(this.configs.graphEndpoint as string, query);

        if (response['deposit'].length > 0) {
          dailyData.volumeInUseUSD += new BigNumber(response['deposit'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dailyData.transactionCount += Number(response['deposit'][0].count);
        }
        if (response['withdraw'].length > 0) {
          dailyData.volumeInUseUSD += new BigNumber(response['withdraw'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dailyData.transactionCount += Number(response['withdraw'][0].count);
        }
        if (response['borrow'].length > 0) {
          dailyData.volumeInUseUSD += new BigNumber(response['borrow'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dailyData.transactionCount += Number(response['borrow'][0].count);
        }
        if (response['repay'].length > 0) {
          dailyData.volumeInUseUSD += new BigNumber(response['repay'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          dailyData.transactionCount += Number(response['repay'][0].count);
        }

        // count liquidity
        dailyData.totalValueLockedUSD = new BigNumber(response['overview'][0].totalBalancesUsd)
          .dividedBy(1e18)
          .toNumber();
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed to get hourly data',
          props: {
            date: new Date(date * 1000).toISOString().split('T')[0],
            endpoint: this.configs.graphEndpoint,
          },
          error: e.message,
        });
      }

      // next hour
      fromTime += 60 * 60;
    }

    return dailyData;
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { date, providers } = props;

    const dateData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    // query date data
    const metaBlock = await providers.subgraph.queryMetaLatestBlock(this.configs.graphEndpoint);
    const blockAtDate = await providers.subgraph.queryBlockAtTimestamp(
      this.configs.chainConfig.subgraph.blockSubgraph as string,
      date
    );
    const blockNumber = blockAtDate < metaBlock ? blockAtDate : metaBlock;

    try {
      const query = `
				{
					deposit: dailyDeposits(where: {timestamp: ${date}}) {
						count,
						totalUsdAmount,
					}
					withdraw: dailyWithdraws(where: {timestamp: ${date}}) {
						count,
						totalUsdAmount,
					}
					borrow: dailyBorrows(where: {timestamp: ${date}}) {
						count,
						totalUsdAmount,
					}
					repay: dailyRepays(where: {timestamp: ${date}}) {
						count,
						totalUsdAmount,
					}
					overview: eulerOverviews(first: 1, block: {number: ${blockNumber}}) {
            totalBalancesUsd
          }
				}
			`;
      const response = await providers.subgraph.querySubgraph(this.configs.graphEndpoint as string, query);

      if (response['deposit'].length > 0) {
        dateData.volumeInUseUSD += new BigNumber(response['deposit'][0].totalUsdAmount).dividedBy(1e18).toNumber();
        dateData.transactionCount += Number(response['deposit'][0].count);
      }
      if (response['withdraw'].length > 0) {
        dateData.volumeInUseUSD += new BigNumber(response['withdraw'][0].totalUsdAmount).dividedBy(1e18).toNumber();
        dateData.transactionCount += Number(response['withdraw'][0].count);
      }
      if (response['borrow'].length > 0) {
        dateData.volumeInUseUSD += new BigNumber(response['borrow'][0].totalUsdAmount).dividedBy(1e18).toNumber();
        dateData.transactionCount += Number(response['borrow'][0].count);
      }
      if (response['repay'].length > 0) {
        dateData.volumeInUseUSD += new BigNumber(response['repay'][0].totalUsdAmount).dividedBy(1e18).toNumber();
        dateData.transactionCount += Number(response['repay'][0].count);
      }

      // count liquidity
      dateData.totalValueLockedUSD = new BigNumber(response['overview'][0].totalBalancesUsd).dividedBy(1e18).toNumber();
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to get date data',
        props: {
          date: new Date(date * 1000).toISOString().split('T')[0],
          endpoint: this.configs.graphEndpoint,
        },
        error: e.message,
      });
    }

    return dateData;
  }
}

export default EulerProvider;
