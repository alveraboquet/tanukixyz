import { getChainConfig } from '../../../../configs/chains';
import { UniswapProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import { GetProtocolDataProps } from '../collector';
import { PancakeswapProvider } from './pancakeswap';

export class PancakeswapStreamFastProvider extends PancakeswapProvider {
  public readonly name: string = 'provider.pancakeswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // streamfast graph endpoint has issues with dayDatas query
  // we need to get data from factories query
  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { providers, date } = props;

    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    try {
      const blockNumberStartDate = await providers.subgraph.queryBlockAtTimestamp(
        getChainConfig('binance').subgraph?.blockSubgraph as string,
        date
      );
      let blockNumberEndDate = await providers.subgraph.queryBlockAtTimestamp(
        getChainConfig('binance').subgraph?.blockSubgraph as string,
        date + 24 * 60 * 60
      );

      // in case subgraph not full sync yet
      const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(this.configs.subgraphs[0].exchange);
      blockNumberEndDate = blockNumberEndDate > blockNumberMeta ? blockNumberMeta : blockNumberEndDate;

      const response = await providers.subgraph.querySubgraph(
        this.configs.subgraphs[0].exchange,
        `
				{
					startDate: pancakeFactories(block: {number: ${blockNumberStartDate}}) {
						totalVolumeUSD
            totalLiquidityUSD
            totalTransactions
					}
					endDate: pancakeFactories(block: {number: ${blockNumberEndDate}}) {
						totalVolumeUSD
            totalLiquidityUSD
            totalTransactions
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
        const volumeUSD =
          Number(response['endDate'][0].totalVolumeUSD) - Number(response['startDate'][0].totalVolumeUSD);
        data.revenueUSD = (volumeUSD * 0.3) / 100;
        data.volumeInUseUSD = volumeUSD;
        data.totalValueLockedUSD =
          Number(response['endDate'][0].totalLiquidityUSD) - Number(response['startDate'][0].totalLiquidityUSD);
        data.transactionCount =
          Number(response['endDate'][0].totalTransactions) - Number(response['startDate'][0].totalTransactions);
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed top query protocol subgraph',
        props: {
          name: this.configs.name,
          endpoint: this.configs.subgraphs[0],
        },
        error: e.message,
      });
    }

    return data;
  }
}
