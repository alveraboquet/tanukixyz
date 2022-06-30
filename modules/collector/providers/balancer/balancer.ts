import { DefiProtocolModuleCode } from '../../../../configs';
import { BalancerProtocolConfig } from '../../../../configs/types';
import { ProtocolDateData } from '../../types';
import CollectorProvider, { GetProtocolDateDataProps } from '../collector';

export class BalancerProvider extends CollectorProvider {
  public readonly name: string = 'provider.balancer';

  constructor(configs: BalancerProtocolConfig) {
    super(configs);
  }

  public async getDateData(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { providers, date } = props;

    const dateData: ProtocolDateData = {
      module: DefiProtocolModuleCode,
      name: this.configs.name,
      date: date,
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
        date
      );
      let blockNumberEndDate = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
        date + 24 * 60 * 60
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
        dateData.totalValueLockedUSD += Number(response['endDate'][0]['totalLiquidity']);
      }
    }

    return dateData;
  }
}
