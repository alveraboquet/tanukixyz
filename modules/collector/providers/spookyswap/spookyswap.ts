import { UniswapProtocolConfig } from '../../../../configs/types';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

export class SpookyswapProvider extends CollectorProvider {
  public readonly name: string = 'provider.spookyswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayData: {
        dayDataVar: 'uniswapDayDatas',
        totalVolume: 'dailyVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },

      factory: {
        factoryVar: 'uniswapFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },

      // support uniswap v3 queries
      v3: {
        dayData: {
          dayDataVar: 'poolDayDatas',
          totalFee: 'feesUSD',
          totalVolume: 'volumeUSD',
          totalLiquidity: 'tvlUSD',
          totalTransaction: 'txCount',
        },

        factory: {
          factoryVar: 'factories',
          totalFee: 'totalFeesUSD',
          totalVolume: 'totalVolumeUSD',
          totalLiquidity: 'totalValueLockedUSD',
          totalTransaction: 'txCount',
        },
      },
    };
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { providers, date } = props;

    const endTimestamp = date;

    // last 24 hours
    const last24HoursTimestamp = date - 24 * 60 * 60;
    // last 48 hours
    const last48HoursTimestamp = date - 48 * 60 * 60;

    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < this.configs.subgraphs.length; i++) {
      logger.onDebug({
        source: this.name,
        message: 'querying volume, tvl, tcxCount from subgraph',
        props: {
          name: this.configs.name,
          endpoint: this.configs.subgraphs[i].exchange,
        },
      });
      const filters: any =
        this.configs.subgraphs[i].version === 2 ? this.getFilters().factory : this.getFilters().v3.factory;
      const blockNumberLast24Hours = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].exchange,
        last24HoursTimestamp
      );
      const blockNumberLast48Hours = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].exchange,
        last48HoursTimestamp
      );
      const blockNumberEndTime = await providers.subgraph.queryBlockAtTimestamp(
        this.configs.subgraphs[i].exchange,
        endTimestamp
      );

      const response = await providers.subgraph.querySubgraph(
        this.configs.subgraphs[i].exchange,
        `
				{
          data: ${filters.factoryVar}(block: {number: ${blockNumberEndTime}}) {
            ${this.configs.subgraphs[i].version === 3 ? filters.totalFee : ''}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
            ${filters.totalTransaction}
          }
					data24: ${filters.factoryVar}(block: {number: ${blockNumberLast24Hours}}) {
					  ${this.configs.subgraphs[i].version === 3 ? filters.totalFee : ''}
						${filters.totalVolume}
						${filters.totalLiquidity}
						${filters.totalTransaction}
					}
					data48: ${filters.factoryVar}(block: {number: ${blockNumberLast48Hours}}) {
					  ${this.configs.subgraphs[i].version === 3 ? filters.totalFee : ''}
						${filters.totalVolume}
						${filters.totalLiquidity}
						${filters.totalTransaction}
					}
				}
			`
      );

      const parsed = response && response['data'] ? response['data'][0] : null;
      const parsed24 = response && response['data24'] ? response['data24'][0] : null;
      const parsed48 = response && response['data48'] ? response['data48'][0] : null;

      if (parsed && parsed24) {
        const volumeUSD = Number(parsed[filters.totalVolume]) - Number(parsed24[filters.totalVolume]);
        data.revenueUSD +=
          this.configs.subgraphs[i].version === 2
            ? (volumeUSD * 0.3) / 100
            : Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
        data.volumeInUseUSD += volumeUSD;
        data.totalValueLockedUSD += Number(parsed[filters.totalLiquidity]);
        data.transactionCount += Number(parsed[filters.totalTransaction]) - Number(parsed24[filters.totalTransaction]);
      }

      if (parsed && parsed24 && parsed48) {
        const volumeUSD = Number(parsed[filters.totalVolume]) - Number(parsed24[filters.totalVolume]);
        const volumeUSD24 = Number(parsed24[filters.totalVolume]) - Number(parsed48[filters.totalVolume]);
        const revenueUSD =
          this.configs.subgraphs[i].version === 2
            ? (volumeUSD * 0.3) / 100
            : Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
        const revenueUSD24 =
          this.configs.subgraphs[i].version === 2
            ? (volumeUSD * 0.3) / 100
            : Number(parsed24[filters.totalFee]) - Number(parsed48[filters.totalFee]);
        const totalValueLockedUSD = Number(parsed[filters.totalLiquidity]);
        const totalValueLockedUSD24 = Number(parsed24[filters.totalLiquidity]);
        const transactionCount = Number(parsed[filters.totalTransaction]) - Number(parsed24[filters.totalTransaction]);
        const transactionCount24 =
          Number(parsed24[filters.totalTransaction]) - Number(parsed48[filters.totalTransaction]);

        data.changes = {
          revenueChangePercentage: ((revenueUSD - revenueUSD24) / revenueUSD24) * 100,
          totalValueLockedChangePercentage:
            ((totalValueLockedUSD - totalValueLockedUSD24) / totalValueLockedUSD24) * 100,
          volumeInUseChangePercentage: ((volumeUSD - volumeUSD24) / volumeUSD24) * 100,
          userCountChangePercentage: 0,
          transactionCountChangePercentage: ((transactionCount - transactionCount24) / transactionCount24) * 100,
        };
      }
    }

    return data;
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };
  }
}
