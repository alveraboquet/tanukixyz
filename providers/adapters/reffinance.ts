import { RefFinanceConfig } from '../../configs/protocols/reffinance';
import { ShareProviders } from '../../lib/types';
import { RefFinanceProvider } from '../../modules/collector/providers/reffinance/reffinance';
import { DefiAdapter } from '../adapter';

export class RefFinanceAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.reffinance';

  constructor(configs: RefFinanceConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new RefFinanceProvider(configs);
  }
}
