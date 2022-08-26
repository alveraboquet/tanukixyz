import { Compound3ProtocolConfig } from '../../configs/protocols/compound';
import { CompoundProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { CompoundProvider } from '../../modules/collector/providers/compound/compound';
import { Compound3Provider } from '../../modules/collector/providers/compound/compound3';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class CompoundAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.compound';

  constructor(configs: CompoundProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new CompoundProvider(configs);
    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}

export class Compound3Adapter extends DefiAdapter {
  public readonly name: string = 'adapter.compound3';

  constructor(configs: Compound3ProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new Compound3Provider(configs);
    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}
