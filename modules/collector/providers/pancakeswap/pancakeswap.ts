import { DefiProtocolModuleCode } from '../../../../configs';
import { UniswapProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ProtocolDateData } from '../../types';
import { GetProtocolDateDataProps } from '../collector';
import { UniswapV2Provider } from '../uniswap/uniswapv2';
import {getChainConfig} from "../../../../configs/chains";

export class PancakeswapProvider extends UniswapV2Provider {
  public readonly name: string = 'provider.pancakeswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayDataVar: 'pancakeDayDatas',
      totalVolume: 'totalVolumeUSD',
      totalLiquidity: 'totalLiquidityUSD',
      totalTransaction: 'totalTransactions',
    };
  }

  // streamfast graph endpoint has issues with dayDatas query
  // we need to get data from factories query
  public async getDateData(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { providers, date } = props;

    const data: ProtocolDateData = {
      module: DefiProtocolModuleCode,
      date: date,
      name: this.configs.name,

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
      const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(this.configs.subgraphs[0]);
      blockNumberEndDate = blockNumberEndDate > blockNumberMeta ? blockNumberMeta : blockNumberEndDate;

      const response = await providers.subgraph.querySubgraph(
        this.configs.subgraphs[0],
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

      if (response['startDate'] && response['startDate'].length > 0 && response['endDate'] && response['endDate'].length > 0) {
        const volumeUSD = Number(response['endDate'][0].totalVolumeUSD) - Number(response['startDate'][0].totalVolumeUSD);
        data.revenueUSD = volumeUSD * 0.3 / 100;
        data.volumeInUseUSD = volumeUSD;
        data.totalValueLockedUSD = Number(response['endDate'][0].totalLiquidityUSD) - Number(response['startDate'][0].totalLiquidityUSD);
        data.transactionCount = Number(response['endDate'][0].totalTransactions) - Number(response['startDate'][0].totalTransactions);
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
