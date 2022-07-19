import BigNumber from 'bignumber.js';

import { EulerProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import { CollectorProvider } from '../collector';
import { CollectorHook } from '../hook';

export class EulerProvider extends CollectorProvider {
  public readonly name: string = 'provider.euler';

  constructor(configs: EulerProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
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
      toTime
    );
    const blockNumber = blockAtDate < metaBlock ? blockAtDate : metaBlock;

    let startTime = fromTime;
    while (startTime < toTime) {
      try {
        const query = `
				{
					deposit: hourlyDeposits(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					withdraw: hourlyWithdraws(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					borrow: hourlyBorrows(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					repay: hourlyRepays(where: {timestamp_gte: ${startTime}}) {
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
          data.volumeInUseUSD += new BigNumber(response['deposit'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          data.transactionCount += Number(response['deposit'][0].count);
        }
        if (response['withdraw'].length > 0) {
          data.volumeInUseUSD += new BigNumber(response['withdraw'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          data.transactionCount += Number(response['withdraw'][0].count);
        }
        if (response['borrow'].length > 0) {
          data.volumeInUseUSD += new BigNumber(response['borrow'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          data.transactionCount += Number(response['borrow'][0].count);
        }
        if (response['repay'].length > 0) {
          data.volumeInUseUSD += new BigNumber(response['repay'][0].totalUsdAmount).dividedBy(1e18).toNumber();
          data.transactionCount += Number(response['repay'][0].count);
        }

        // count liquidity
        data.totalValueLockedUSD = new BigNumber(response['overview'][0].totalBalancesUsd).dividedBy(1e18).toNumber();
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed to get hourly data',
          props: {
            date: new Date(toTime * 1000).toISOString().split('T')[0],
            endpoint: this.configs.graphEndpoint,
          },
          error: e.message,
        });
      }

      // next hour
      startTime += 60 * 60;
    }

    // count user & transaction
    try {
      startTime = fromTime;
      const addresses: any = {};
      const transactions: any = {};

      while (startTime < toTime) {
        const balanceChangesResponses = await providers.subgraph.querySubgraph(
          this.configs.graphEndpoint,
          `
            {
              balanceChanges(first: 1000, where: {timestamp_gte: ${startTime}}, orderBy: timestamp, orderDirection: asc) {
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
            data.transactionCount += 1;
            transactions[balanceChanges[i].transactionHash] = true;
          }
          if (balanceChanges[i].account.id && !addresses[normalizeAddress(balanceChanges[i].account.id)]) {
            data.userCount += 1;
            addresses[normalizeAddress(balanceChanges[i].account.id)] = true;
          }
        }

        if (balanceChanges.length > 0) {
          startTime = Number(balanceChanges[balanceChanges.length - 1]['timestamp']) + 1;
        } else {
          // no more records
          break;
        }
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

    return data;
  }
}
