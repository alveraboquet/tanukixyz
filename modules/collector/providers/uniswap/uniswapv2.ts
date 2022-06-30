import { DefiProtocolModuleCode } from '../../../../configs';
import { UniswapProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ProtocolDateData } from '../../types';
import CollectorProvider, { GetProtocolDateDataProps } from '../collector';

export class UniswapV2Provider extends CollectorProvider {
  public readonly name: string = 'provider.uniswapv2';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
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
    const filters: any = this.getFilters();

    for (let i = 0; i < this.configs.subgraphs.length; i++) {
      try {
        const response = await providers.subgraph.querySubgraph(
          this.configs.subgraphs[i],
          `
				{
					${filters.dayDataVar}(first: 1, where: {date: ${date}}) {
						${filters.totalVolume}
						${filters.totalLiquidity}
						${filters.totalTransaction}
					}
				}
			`
        );

        if (response[filters.dayDataVar] && response[filters.dayDataVar].length > 0) {
          data.volumeInUseUSD += Number(response[filters.dayDataVar][0][filters.totalVolume]);
          data.revenueUSD += (Number(response[filters.dayDataVar][0][filters.totalVolume]) * 0.3) / 100;
          data.totalValueLockedUSD += Number(response[filters.dayDataVar][0][filters.totalLiquidity]);
          data.transactionCount += Number(response[filters.dayDataVar][0][filters.totalTransaction]);
        }
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed top query protocol subgraph',
          props: {
            name: this.configs.name,
            endpoint: this.configs.subgraphs[i],
          },
          error: e.message,
        });
      }
    }

    return data;
  }
}
