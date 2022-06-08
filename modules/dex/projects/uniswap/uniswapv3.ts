import { DexConfig } from '../../types';
import { UniswapV2Provider } from './uniswapv2';

export class UniswapV3Provider extends UniswapV2Provider {
  public readonly name: string = 'uniswapv3.provider';

  constructor(config: DexConfig) {
    super(config);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      factory: 'factories',
      totalFeeUSD: 'totalFeesUSD',
      totalVolumeUSD: 'totalVolumeUSD',
      totalLiquidityUSD: 'totalValueLockedUSD',
      transactionCount: 'txCount',
    };
  }
}
