import { UniswapProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { UniswapProvider } from '../../modules/collector/providers/uniswap/uniswap';
import { DefiAdapter } from '../adapter';

export class UniswapAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.uniswap';

  constructor(configs: UniswapProtocolConfig, providers: ShareProviders, useCollector: UniswapProvider) {
    super(configs, providers);

    this.collector = useCollector;
  }
}
