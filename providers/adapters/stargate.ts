import { StargateProtocolConfig } from '../../configs/protocols/stargate';
import { ShareProviders } from '../../lib/types';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class StargateAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.stargate';

  constructor(configs: StargateProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = null;
    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}
