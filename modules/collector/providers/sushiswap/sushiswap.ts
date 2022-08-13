import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapProvider } from '../uniswap/uniswap';

export class SushiswapProvider extends UniswapProvider {
  public readonly name: string = 'collector.sushiswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
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
      token: {
        tokenTradeVolume: 'volumeUSD',
        tokenLiquidity: 'liquidity',
        tokenTxCount: 'txCount',
        derivedETH: 'derivedETH',
      },
    };
  }
}
