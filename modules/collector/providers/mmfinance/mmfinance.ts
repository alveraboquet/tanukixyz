import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapProvider } from '../uniswap/uniswap';

export class MmfinanceProvider extends UniswapProvider {
  public readonly name: string = 'collector.mmfinance';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      factory: {
        factoryVar: 'pancakeFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
      dayData: {
        dayDataVar: 'pancakeDayDatas',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'totalTransactions',
      },
      token: {
        tokenTradeVolume: 'tradeVolumeUSD',
        tokenLiquidity: 'totalLiquidity',
        tokenTxCount: 'totalTransactions',
        derivedETH: 'derivedCRO',
      },
    };
  }
}
