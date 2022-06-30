import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapV2Provider } from '../uniswap/uniswapv2';

export class PancakeswapProvider extends UniswapV2Provider {
  public readonly name: string = 'provider.pancakeswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayDataVar: 'pancakeDayDatas',
      totalVolume: 'totalVolumeUSD',
      totalLiquidity: 'totalLiquidityUSD',
      totalTransaction: 'totalTransactions',
    };
  }
}
