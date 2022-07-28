import { CompoundProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { CompoundProvider } from '../../modules/collector/providers/compound/compound';
import { EventIndexerProvider } from '../../modules/indexer/provider';
import { DefiAdapter } from '../adapter';

export class CompoundAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.compound';

  constructor(configs: CompoundProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new CompoundProvider(configs, null);
    for (let i = 0; i < this.configs.pools.length; i++) {
      this.indexer.push(new EventIndexerProvider(this.providers, this.configs.pools[i], null));
    }
  }
}
