import { DefiProtocolModuleCode } from '../../../../configs';
import { CompoundProtocolConfig, UniswapProtocolConfig } from '../../../../configs/types';
import { ProtocolDateData } from '../../types';
import CollectorProvider, { GetProtocolDateDataProps } from '../collector';
import CompoundProvider from '../compound/compound';
import { UniswapV2Provider } from '../uniswap/uniswapv2';

export interface TraderjoeProtocolConfig {
  exchange: UniswapProtocolConfig;
  lending: CompoundProtocolConfig;
}

class TraderjoeProvider extends CollectorProvider {
  public readonly name: string = 'provider.traderjoe';

  private exchangeProvider: UniswapV2Provider;
  private lendingProvider: CompoundProvider;

  constructor(configs: TraderjoeProtocolConfig) {
    super(configs);

    this.exchangeProvider = new UniswapV2Provider(this.configs.exchange);
    this.lendingProvider = new CompoundProvider(this.configs.lending);
  }

  public async getDateData(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const exchangeData: ProtocolDateData = await this.exchangeProvider.getDateData(props);
    const lendingData: ProtocolDateData = await this.lendingProvider.getDateData(props);

    return {
      module: DefiProtocolModuleCode,
      name: 'traderjoe',
      date: props.date,

      revenueUSD: exchangeData.revenueUSD + lendingData.revenueUSD,
      totalValueLockedUSD: exchangeData.totalValueLockedUSD + lendingData.totalValueLockedUSD,
      volumeInUseUSD: exchangeData.volumeInUseUSD + lendingData.volumeInUseUSD,
      userCount: exchangeData.userCount + lendingData.userCount,
      transactionCount: exchangeData.transactionCount + lendingData.transactionCount,
    };
  }
}

export default TraderjoeProvider;
