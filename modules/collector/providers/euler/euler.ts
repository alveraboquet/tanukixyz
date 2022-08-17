import BigNumber from 'bignumber.js';

import { EulerProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData } from '../../types';

export class EulerProvider extends CollectorProvider {
  public readonly name: string = 'collector.euler';

  constructor(configs: EulerProtocolConfig) {
    super(configs);
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

        const deposits: Array<any> = response && response.deposit ? response.deposit : [];
        const withdraws: Array<any> = response && response.withdraw ? response.withdraw : [];
        const borrows: Array<any> = response && response.borrow ? response.borrow : [];
        const repays: Array<any> = response && response.repay ? response.repay : [];

        const events: Array<any> = deposits.concat(withdraws).concat(borrows).concat(repays);

        const overview: any = response && response.overview && response.overview.length > 0 ? response.overview[0] : null;

        for (const event of events) {
          let volume = new BigNumber(event.totalUsdAmount).dividedBy(1e18);

          // handle subgraph data errors
          if (volume.gte(1e18)) {
            volume = volume.dividedBy(1e18);
          }
          data.volumeInUseUSD += volume.toNumber();
          data.transactionCount += Number(event.count);
        }

        if (overview) {
          // count liquidity
          data.totalValueLockedUSD = new BigNumber(overview.totalBalancesUsd).dividedBy(1e18).toNumber();
        }
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
    // try {
    //   startTime = fromTime;
    //   const addresses: any = {};
    //   const transactions: any = {};
    //
    //   while (startTime < toTime) {
    //     const balanceChangesResponses = await providers.subgraph.querySubgraph(
    //       this.configs.graphEndpoint,
    //       `
    //         {
    //           balanceChanges(first: 1000, where: {timestamp_gte: ${startTime}}, orderBy: timestamp, orderDirection: asc) {
    //             timestamp
    //             transactionHash
    //             account {
    //               id
    //             }
    //           }
    //         }
    //       `
    //     );
    //
    //     const balanceChanges: Array<any> =
    //       balanceChangesResponses && balanceChangesResponses['balanceChanges']
    //         ? balanceChangesResponses['balanceChanges']
    //         : [];
    //     for (let i = 0; i < balanceChanges.length; i++) {
    //       if (balanceChanges[i].transactionHash && !transactions[balanceChanges[i].transactionHash]) {
    //         data.transactionCount += 1;
    //         transactions[balanceChanges[i].transactionHash] = true;
    //       }
    //       if (balanceChanges[i].account.id && !addresses[normalizeAddress(balanceChanges[i].account.id)]) {
    //         data.userCount += 1;
    //         addresses[normalizeAddress(balanceChanges[i].account.id)] = true;
    //       }
    //     }
    //
    //     if (balanceChanges.length > 0) {
    //       startTime = Number(balanceChanges[balanceChanges.length - 1]['timestamp']) + 1;
    //     } else {
    //       // no more records
    //       break;
    //     }
    //   }
    // } catch (e: any) {
    //   logger.onDebug({
    //     source: this.name,
    //     message: 'failed to count daily users',
    //     props: {
    //       name: this.configs.name,
    //       error: e.message,
    //     },
    //   });
    // }

    return data;
  }
}
