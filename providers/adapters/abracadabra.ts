import { AbracadabraProtocolConfig } from '../../configs/protocols/abracadabra';
import { ShareProviders } from '../../lib/types';
import { AbracadabraProvider } from '../../modules/collector/providers/abracadabra/abracadabra';
import { EventIndexerProvider } from '../../modules/indexer/provider';
import { DefiAdapter } from '../adapter';

export class AbracadabraAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.abracadabra';

  constructor(configs: AbracadabraProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new AbracadabraProvider(configs, null);
    for (let i = 0; i < this.configs.markets.length; i++) {
      this.indexer.push(new EventIndexerProvider(this.providers, this.configs.markets[i], null));
    }
  }
}
