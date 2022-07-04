import { CompoundProtocolConfig, UniswapProtocolConfig } from '../../../../configs/types';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';
import CompoundProvider from '../compound/compound';
import { SushiswapProvider } from '../sushiswap/sushiswap';

export interface TraderjoeProtocolConfig {
  name: string;
  exchange: UniswapProtocolConfig;
  lending: CompoundProtocolConfig;
}

class TraderjoeProvider extends CollectorProvider {
  public readonly name: string = 'provider.traderjoe';

  private exchangeProvider: SushiswapProvider;
  private lendingProvider: CompoundProvider;

  constructor(configs: TraderjoeProtocolConfig) {
    super(configs);

    this.exchangeProvider = new SushiswapProvider(this.configs.exchange);
    this.lendingProvider = new CompoundProvider(this.configs.lending);
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

export default TraderjoeProvider;
