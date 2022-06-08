import { DexConfig } from '../types';
import { UniswapV2Provider } from './uniswap/uniswapv2';

export class PancakeSwapProvider extends UniswapV2Provider {
  constructor(config: DexConfig) {
    super(config);
  }

  // uniswap v3 filters
  public getFilters(): any {
    return {
      factory: 'pancakeFactories',
      totalFeeUSD: '',
      totalVolumeUSD: 'totalVolumeUSD',
      totalLiquidityUSD: 'totalLiquidityUSD',
      transactionCount: 'totalTransactions',
    };
  }
}
