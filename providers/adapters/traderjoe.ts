import { ShareProviders } from '../../lib/types';
import { TraderjoeProtocolConfig, TraderjoeProvider } from '../../modules/collector/providers/traderjoe/traderjoe';
import { EventIndexerProvider } from '../../modules/indexer/provider';
import { DefiAdapter } from '../adapter';

export class TraderJoeAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.traderjoe';

  constructor(configs: TraderjoeProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new TraderjoeProvider(configs, null);

    for (let i = 0; i < this.configs.lending.pools.length; i++) {
      this.indexer.push(new EventIndexerProvider(this.providers, this.configs.lending.pools[i], null));
    }
  }
}
