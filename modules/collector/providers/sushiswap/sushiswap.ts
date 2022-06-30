import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapV2Provider } from '../uniswap/uniswapv2';

export class SushiswapProvider extends UniswapV2Provider {
  public readonly name: string = 'provider.sushiswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayDataVar: 'dayDatas',
      totalVolume: 'volumeUSD',
      totalLiquidity: 'liquidityUSD',
      totalTransaction: 'txCount',
    };
  }
}
