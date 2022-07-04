import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapProvider } from '../uniswap/uniswap';

export class PancakeswapProvider extends UniswapProvider {
  public readonly name: string = 'provider.pancakeswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      factory: {
        factoryVar: 'pancakeFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
      dayData: {
        dayDataVar: 'pancakeDayDatas',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
    };
  }
}
