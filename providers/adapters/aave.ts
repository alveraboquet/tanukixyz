import { AaveProtocolConfig } from '../../configs/types';
import { ShareProviders } from '../../lib/types';
import { AaveProvider } from '../../modules/collector/providers/aave/aave';
import { DefiAdapter } from '../adapter';
import {EvmEventIndexer} from "../../modules/indexer/evm";

export class AaveAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.aave';

  constructor(configs: AaveProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new AaveProvider(configs, null);
    this.indexer = new EvmEventIndexer(providers, configs.pools);
  }
}
