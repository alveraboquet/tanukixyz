import { DexConfig } from '../types';
import { UniswapV2Provider } from './uniswap/uniswapv2';

export class BalancerProvider extends UniswapV2Provider {
  constructor(config: DexConfig) {
    super(config);
  }

  // uniswap v3 filters
  public getFilters(): any {
    return {
      factory: 'balancers',
      totalFeeUSD: 'totalSwapFee',
      totalVolumeUSD: 'totalSwapVolume',
      totalLiquidityUSD: 'totalLiquidity',
      transactionCount: 'totalSwapCount',
    };
  }
}
