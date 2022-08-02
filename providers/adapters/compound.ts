import { CompoundProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { CompoundProvider } from '../../modules/collector/providers/compound/compound';
import { DefiAdapter } from '../adapter';
import {EvmEventIndexer} from "../../modules/indexer/evm";

export class CompoundAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.compound';

  constructor(configs: CompoundProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new CompoundProvider(configs, null);
    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}
