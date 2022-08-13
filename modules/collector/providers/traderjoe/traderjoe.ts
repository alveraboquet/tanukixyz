import { CompoundProtocolConfig, TokenConfig, UniswapProtocolConfig } from '../../../../configs/types';
import { CollectorProvider, GetProtocolDataProps } from '../../collector';
import { ProtocolData } from '../../types';
import { CompoundProvider } from '../compound/compound';
import { UniswapProvider } from '../uniswap/uniswap';

export interface TraderjoeProtocolConfig {
  name: string;
  exchange: UniswapProtocolConfig;
  lending: CompoundProtocolConfig;
  tokenomics: TokenConfig;
}

class TraderjoeDexProvider extends UniswapProvider {
  public readonly name: string = 'collector.traderjoe';

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
        derivedETH: 'derivedAVAX',
      },
    };
  }
}

export class TraderjoeProvider extends CollectorProvider {
  public readonly name: string = 'collector.traderjoe';

  private exchangeProvider: TraderjoeDexProvider;
  private lendingProvider: CompoundProvider;

  constructor(configs: TraderjoeProtocolConfig) {
    super(configs);

    this.exchangeProvider = new TraderjoeDexProvider(this.configs.exchange);
    this.lendingProvider = new CompoundProvider(this.configs.lending);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const exchangeData: ProtocolData = await this.exchangeProvider.getDailyData(props);
    const lendingData: ProtocolData = await this.lendingProvider.getDailyData(props);

    return {
      tokenomics: lendingData.tokenomics,
      revenueUSD: exchangeData.revenueUSD + lendingData.revenueUSD,
      totalValueLockedUSD: exchangeData.totalValueLockedUSD + lendingData.totalValueLockedUSD,
      volumeInUseUSD: exchangeData.volumeInUseUSD + lendingData.volumeInUseUSD,
      userCount: exchangeData.userCount + lendingData.userCount,
      transactionCount: exchangeData.transactionCount + lendingData.transactionCount,
    };
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const exchangeData: ProtocolData = await this.exchangeProvider.getDateData(props);
    const lendingData: ProtocolData = await this.lendingProvider.getDateData(props);

    return {
      tokenomics: lendingData.tokenomics,
      revenueUSD: exchangeData.revenueUSD + lendingData.revenueUSD,
      totalValueLockedUSD: exchangeData.totalValueLockedUSD + lendingData.totalValueLockedUSD,
      volumeInUseUSD: exchangeData.volumeInUseUSD + lendingData.volumeInUseUSD,
      userCount: exchangeData.userCount + lendingData.userCount,
      transactionCount: exchangeData.transactionCount + lendingData.transactionCount,
    };
  }
}
