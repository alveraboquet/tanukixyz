import { DefiProtocolModuleCode } from '../../../../configs';
import { UniswapV1Configs, UniswapV3Configs } from '../../../../configs/protocols/uniswap';
import { UniswapProtocolConfig } from '../../../../configs/types';
import { ProtocolDateData } from '../../types';
import { GetProtocolDateDataProps } from '../collector';
import { UniswapV2Provider } from './uniswapv2';

export class UniswapProvider extends UniswapV2Provider {
  public readonly name: string = 'provider.uniswapv';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  public async getMetricV1(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { providers, date } = props;
    const v1QueryResponse = await providers.subgraph.querySubgraph(
      UniswapV1Configs.subgraphs[0],
      `
			{
				uniswapDayDatas(first: 1, where: {date: ${date}}) {
					dailyVolumeInUSD
					totalLiquidityUSD
					txCount
				}
			}
		`
    );

    const v1Data = v1QueryResponse['uniswapDayDatas'].length > 0 ? v1QueryResponse['uniswapDayDatas'][0] : null;
    return {
      module: DefiProtocolModuleCode,
      name: 'uniswap',
      date: date,
      userCount: 0,
      volumeInUseUSD: v1Data ? Number(v1Data['dailyVolumeInUSD']) : 0,
      revenueUSD: v1Data ? (Number(v1Data['dailyVolumeInUSD']) * 0.3) / 100 : 0,
      totalValueLockedUSD: v1Data ? Number(v1Data['totalLiquidityUSD']) : 0,
      transactionCount: v1Data ? Number(v1Data['txCount']) : 0,
    };
  }

  public async getMetricV3(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { providers, date } = props;

    const data: ProtocolDateData = {
      module: DefiProtocolModuleCode,
      name: 'uniswap',
      date: date,
      userCount: 0,
      volumeInUseUSD: 0,
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < UniswapV3Configs.subgraphs.length; i++) {
      const v3QueryResponse = await providers.subgraph.querySubgraph(
        UniswapV3Configs.subgraphs[i],
        `
			{
				uniswapDayDatas(first: 1, where: {date: ${date}}) {
					volumeUSD
					tvlUSD
					feesUSD
					txCount
				}
			}
		`
      );

      const v3Data = v3QueryResponse['uniswapDayDatas'].length > 0 ? v3QueryResponse['uniswapDayDatas'][0] : null;
      data.volumeInUseUSD += v3Data ? Number(v3Data['volumeUSD']) : 0;
      data.revenueUSD += v3Data ? Number(v3Data['feesUSD']) : 0;
      data.totalValueLockedUSD += v3Data ? Number(v3Data['tvlUSD']) : 0;
      data.transactionCount += v3Data ? Number(v3Data['txCount']) : 0;
    }

    return data;
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayDataVar: 'uniswapDayDatas',
      totalVolume: 'dailyVolumeUSD',
      totalLiquidity: 'totalLiquidityUSD',
      totalTransaction: 'txCount',
    };
  }

  public async getDateData(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { providers, date } = props;

    const metricsV1 = await this.getMetricV1({ providers, date });
    const metricsV2 = await super.getDateData({ providers, date });
    const metricsV3 = await this.getMetricV3({ providers, date });

    const revenueUSD = metricsV1.revenueUSD + metricsV2.revenueUSD + metricsV3.revenueUSD;
    const totalValueLockedUSD =
      metricsV1.totalValueLockedUSD + metricsV2.totalValueLockedUSD + metricsV3.totalValueLockedUSD;
    const volumeInUseUSD = metricsV1.volumeInUseUSD + metricsV2.volumeInUseUSD + metricsV3.volumeInUseUSD;
    const transactionCount = metricsV1.transactionCount + metricsV2.transactionCount + metricsV3.transactionCount;

    return {
      module: DefiProtocolModuleCode,
      date: date,
      name: this.configs.name,
      userCount: 0,
      revenueUSD,
      totalValueLockedUSD,
      volumeInUseUSD,
      transactionCount,
    };
  }
}
