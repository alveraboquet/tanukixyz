import BigNumber from 'bignumber.js';

import { EulerProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import database from '../../../../lib/providers/database';
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

    // count user & transaction
    try {
      fromTime = date - 24 * 60 * 60;
      const addresses: any = {};
      const transactions: any = {};

      while (fromTime < date) {
        const balanceChangesResponses = await providers.subgraph.querySubgraph(
          this.configs.graphEndpoint,
          `
            {
              balanceChanges(first: 1000, where: {timestamp_gte: ${fromTime}}) {
                timestamp
                transactionHash
                account {
                  id
                }
              }
            }
          `
        );

        const balanceChanges: Array<any> =
          balanceChangesResponses && balanceChangesResponses['balanceChanges']
            ? balanceChangesResponses['balanceChanges']
            : [];
        for (let i = 0; i < balanceChanges.length; i++) {
          if (balanceChanges[i].transactionHash && !transactions[balanceChanges[i].transactionHash]) {
            dailyData.transactionCount += 1;
            transactions[balanceChanges[i].transactionHash] = true;
          }
          if (balanceChanges[i].account.id && !addresses[normalizeAddress(balanceChanges[i].account.id)]) {
            dailyData.userCount += 1;
            addresses[normalizeAddress(balanceChanges[i].account.id)] = true;
          }
        }

        if (balanceChanges.length > 0) {
          fromTime = Number(balanceChanges[balanceChanges.length - 1]['timestamp']);
        }

        // no more records
        break;
      }
    } catch (e: any) {
      logger.onDebug({
        source: this.name,
        message: 'failed to count daily users',
        props: {
          name: this.configs.name,
          error: e.message,
        },
      });
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
