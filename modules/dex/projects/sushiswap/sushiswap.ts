import { DexConfig } from '../../types';
import { UniswapV2Provider } from '../uniswap/uniswapv2';

export class SushiswapProvider extends UniswapV2Provider {
  constructor(config: DexConfig) {
    super(config);
  }

  // uniswap v3 filters
  public getFilters(): any {
    return {
      factory: 'factories',
      totalFeeUSD: '',
      totalVolumeUSD: 'volumeUSD',
      totalLiquidityUSD: 'liquidityUSD',
      transactionCount: 'txCount',
    };
  }
}
