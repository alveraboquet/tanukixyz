import { ConvexProtocolConfig } from '../../configs/protocols/convex';
import { ShareProviders } from '../../lib/types';
import { ConvexProvider } from '../../modules/collector/providers/convex/convex';
import { DefiAdapter } from '../adapter';

export class ConvexAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.convex';

  constructor(configs: ConvexProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new ConvexProvider(configs, null);
  }
}
