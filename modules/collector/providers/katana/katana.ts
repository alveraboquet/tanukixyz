import { UniswapProtocolConfig } from '../../../../configs/types';
import { CollectorHook } from '../hook';
import { UniswapProvider } from '../uniswap/uniswap';

export class RoninKatanaProvider extends UniswapProvider {
  public readonly name: string = 'provider.katana';

  constructor(configs: UniswapProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayData: {
        dayDataVar: 'katanaDayDatas',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },
      factory: {
        factoryVar: 'katanaFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },
    };
  }
}
