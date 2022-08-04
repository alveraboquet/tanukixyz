import { DodoexProtocolConfig } from '../../configs/protocols/dodoex';
import { ShareProviders } from '../../lib/types';
import { DodoexProvider } from '../../modules/collector/providers/dodoex/dodoex';
import { DefiAdapter } from '../adapter';

export class DodoexAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.dodoex';

  constructor(configs: DodoexProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new DodoexProvider(configs);
  }
}
