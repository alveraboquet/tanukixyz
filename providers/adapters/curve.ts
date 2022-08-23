import { CurveProtocolConfig } from '../../configs/protocols/curve';
import { ShareProviders } from '../../lib/types';
import { CurveProvider } from '../../modules/collector/providers/curve/curve';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class CurveAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.curve';

  constructor(configs: CurveProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new CurveProvider(configs);

    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}
