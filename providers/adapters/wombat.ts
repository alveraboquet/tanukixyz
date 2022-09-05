import { WombatProtocolConfig } from '../../configs/protocols/wombat';
import { ShareProviders } from '../../lib/types';
import { WombatProvider } from '../../modules/collector/providers/wombat/wombat';
import { DefiAdapter } from '../adapter';

export class WombatAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.wombat';

  constructor(configs: WombatProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new WombatProvider(configs);
  }
}
