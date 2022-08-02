import { LiquityProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { LiquityProvider } from '../../modules/collector/providers/liquity/liquity';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class LiquityAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.liquity';

  constructor(configs: LiquityProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new LiquityProvider(configs, null);

    this.indexer = new EvmEventIndexer(providers, [configs.troveManager, configs.borrowOperation]);
  }
}
