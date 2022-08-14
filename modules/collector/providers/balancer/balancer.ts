import BigNumber from 'bignumber.js';

import { BalancerProtocolConfig } from '../../../../configs/types';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData } from '../../types';

export class BalancerProvider extends CollectorProvider {
  public readonly name: string = 'collector.balancer';

  constructor(configs: BalancerProtocolConfig) {
    super(configs);
  }

  private async getOverviewData(
    providers: ShareProviders,
    subgraph: any,
    fromBlock: number,
    toBlock: number
  ): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const transactionCountFilter = `${subgraph.version === 1 ? 'txCount' : 'totalSwapCount'}`;
    const response = await providers.subgraph.querySubgraph(
      subgraph.exchange,
      `
          {
            startDate: balancers(first: 1, block: {number: ${fromBlock}}) {
              totalSwapFee
              totalSwapVolume
              ${transactionCountFilter}
              totalLiquidity
            }
            endDate: balancers(first: 1, block: {number: ${toBlock}}) {
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
      data.revenueUSD +=
        Number(response['endDate'][0]['totalSwapFee']) - Number(response['startDate'][0]['totalSwapFee']);
      data.volumeInUseUSD +=
        Number(response['endDate'][0]['totalSwapVolume']) - Number(response['startDate'][0]['totalSwapVolume']);
      data.transactionCount +=
        Number(response['endDate'][0][transactionCountFilter]) -
        Number(response['startDate'][0][transactionCountFilter]);
      data.totalValueLockedUSD +=
        subgraph.version === 1
          ? new BigNumber(response['endDate'][0]['totalLiquidity']).dividedBy(1e18).toNumber()
          : Number(response['endDate'][0]['totalLiquidity']);
    }

    return data;
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    for (const subgraph of this.configs.subgraphs) {
      const blockNumberStartDate = await providers.subgraph.queryBlockAtTimestamp(
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        fromTime
      );
      let blockNumberEndDate = await providers.subgraph.queryBlockAtTimestamp(
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        toTime
      );

      // in case subgraph not full sync yet
      const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(subgraph.exchange);
      blockNumberEndDate = blockNumberEndDate > blockNumberMeta ? blockNumberMeta : blockNumberEndDate;

      const overviewData: ProtocolData = await this.getOverviewData(
        providers,
        subgraph,
        blockNumberStartDate,
        blockNumberEndDate
      );

      data.revenueUSD += overviewData.revenueUSD;
      data.totalValueLockedUSD += overviewData.totalValueLockedUSD;
      data.volumeInUseUSD += overviewData.volumeInUseUSD;
      data.userCount += overviewData.userCount;
      data.transactionCount += overviewData.transactionCount;
    }

    return data;
  }
}
