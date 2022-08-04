import { BalancerProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { BalancerProvider } from '../../modules/collector/providers/balancer/balancer';
import { DefiAdapter } from '../adapter';

export class BalancerAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.balancer';

  constructor(configs: BalancerProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new BalancerProvider(configs);
  }
}
