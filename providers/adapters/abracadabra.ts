import { AbracadabraProtocolConfig } from '../../configs/protocols/abracadabra';
import { ShareProviders } from '../../lib/types';
import { AbracadabraProvider } from '../../modules/collector/providers/abracadabra/abracadabra';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class AbracadabraAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.abracadabra';

  constructor(configs: AbracadabraProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new AbracadabraProvider(configs);
    this.indexer = new EvmEventIndexer(providers, configs.markets);
  }
}
