import BigNumber from 'bignumber.js';

import { BalancerProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

export class BalancerProvider extends CollectorProvider {
  public readonly name: string = 'provider.balancer';

  constructor(configs: BalancerProtocolConfig) {
    super(configs);
  }

  private async getDatInRange(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const dateData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < this.configs.subgraphs.length; i++) {
      const transactionCountFilter = `${this.configs.subgraphs[i].version === 1 ? 'txCount' : 'totalSwapCount'}`;
      const blockNumberStartDate = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
        fromTime
      );
      let blockNumberEndDate = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
        toTime
      );

      // in case subgraph not full sync yet
      const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(this.configs.subgraphs[i].exchange);
      blockNumberEndDate = blockNumberEndDate > blockNumberMeta ? blockNumberMeta : blockNumberEndDate;

      const response = await providers.subgraph.querySubgraph(
        this.configs.subgraphs[i].exchange,
        `
          {
            startDate: balancers(first: 1, block: {number: ${blockNumberStartDate}}) {
              totalSwapFee
              totalSwapVolume
              ${transactionCountFilter}
              totalLiquidity
            }
            endDate: balancers(first: 1, block: {number: ${blockNumberEndDate}}) {
              totalSwapFee
              totalSwapVolume
              ${transactionCountFilter}
              totalLiquidity
            }
          }
        `
      );
      if (
        response['startDate'] &&
        response['startDate'].length > 0 &&
        response['endDate'] &&
        response['endDate'].length > 0
      ) {
        dateData.revenueUSD +=
          Number(response['endDate'][0]['totalSwapFee']) - Number(response['startDate'][0]['totalSwapFee']);
        dateData.volumeInUseUSD +=
          Number(response['endDate'][0]['totalSwapVolume']) - Number(response['startDate'][0]['totalSwapVolume']);
        dateData.transactionCount +=
          Number(response['endDate'][0][transactionCountFilter]) -
          Number(response['startDate'][0][transactionCountFilter]);
        dateData.totalValueLockedUSD +=
          this.configs.subgraphs[i].version === 1
            ? new BigNumber(response['endDate'][0]['totalLiquidity']).dividedBy(1e18).toNumber()
            : Number(response['endDate'][0]['totalLiquidity']);
      }

      // count user
      try {
        const addresses: any = {};
        let startTime = fromTime;
        while (startTime <= toTime) {
          const transactionsResponses = await providers.subgraph.querySubgraph(
            this.configs.subgraphs[i].exchange,
            `
            {
              swaps(first: 1000, where: {timestamp_gte: ${startTime}}) {
                timestamp
                caller
                userAddress {
                  id
                }
              }
            }
          `
          );
          const transactions =
            transactionsResponses && transactionsResponses['swaps'] ? transactionsResponses['swaps'] : [];
          for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].caller && !addresses[normalizeAddress(transactions[i].caller)]) {
              dateData.userCount += 1;
              addresses[normalizeAddress(transactions[i].caller)] = true;
            }
            if (transactions[i].userAddress.id && !addresses[normalizeAddress(transactions[i].userAddress.id)]) {
              dateData.userCount += 1;
              addresses[normalizeAddress(transactions[i].userAddress.id)] = true;
            }
          }

          if (transactions.length > 0) {
            startTime = Number(transactions[transactions.length - 1]['timestamp']);
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
    }

    return dateData;
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return await this.getDatInRange(props.providers, props.date - 24 * 60 * 60, props.date);
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return await this.getDatInRange(props.providers, props.date, props.date + 24 * 60 * 60);
  }
}
