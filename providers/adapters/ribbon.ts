import { RibbonProtocolConfig } from '../../configs/protocols/ribbon';
import { ShareProviders } from '../../lib/types';
import { RibbonProvider } from '../../modules/collector/providers/ribbon/ribbon';
import { DefiAdapter } from '../adapter';

export class RibbonAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.ribbon';

  constructor(configs: RibbonProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new RibbonProvider(configs);
  }
}
