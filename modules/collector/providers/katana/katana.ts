import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapProvider } from '../uniswap/uniswap';

export class RoninKatanaProvider extends UniswapProvider {
  public readonly name: string = 'collector.katana';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
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
      token: {
        tokenTradeVolume: 'tradeVolumeUSD',
        tokenLiquidity: 'totalLiquidity',
        tokenTxCount: 'txCount',
      },
    };
  }
}
