import { EulerProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { EulerProvider } from '../../modules/collector/providers/euler/euler';
import { DefiAdapter } from '../adapter';

export class EulerAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.euler';

  constructor(configs: EulerProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new EulerProvider(configs);
  }
}
