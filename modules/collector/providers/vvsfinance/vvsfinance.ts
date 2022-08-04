import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapProvider } from '../uniswap/uniswap';

export class VvsfinanceProvider extends UniswapProvider {
  public readonly name: string = 'collector.vvsfinance';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayData: {
        dayDataVar: 'vvsDayDatas',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
      factory: {
        factoryVar: 'vvsFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
    };
  }
}
