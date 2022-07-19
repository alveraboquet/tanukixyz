import { UniswapProtocolConfig } from '../../../../configs/types';
import { CollectorHook } from '../hook';
import { UniswapProvider } from '../uniswap/uniswap';

export class VvsfinanceProvider extends UniswapProvider {
  public readonly name: string = 'provider.vvsfinance';

  constructor(configs: UniswapProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
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
