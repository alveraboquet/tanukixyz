import { UniswapProtocolConfig } from '../../../../configs/types';
import { CollectorHook } from '../hook';
import { UniswapProvider } from '../uniswap/uniswap';

export class SushiswapProvider extends UniswapProvider {
  public readonly name: string = 'collector.sushiswap';

  constructor(configs: UniswapProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayData: {
        dayDataVar: 'dayDatas',
        totalVolume: 'volumeUSD',
        totalLiquidity: 'liquidityUSD',
        totalTransaction: 'txCount',
      },
      factory: {
        factoryVar: 'factories',
        totalVolume: 'volumeUSD',
        totalLiquidity: 'liquidityUSD',
        totalTransaction: 'txCount',
      },
    };
  }
}
