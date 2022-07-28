import { AaveProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { AaveProvider } from '../../modules/collector/providers/aave/aave';
import { EventIndexerProvider } from '../../modules/indexer/provider';
import { DefiAdapter } from '../adapter';

export class AaveAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.aave';

  constructor(configs: AaveProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new AaveProvider(configs, null);
    for (let i = 0; i < this.configs.pools.length; i++) {
      this.indexer.push(new EventIndexerProvider(this.providers, this.configs.pools[i], null));
    }
  }
}
