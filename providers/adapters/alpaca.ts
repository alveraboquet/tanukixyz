import { AlpacaProtocolConfig } from '../../configs/protocols/alpaca';
import { ShareProviders } from '../../lib/types';
import { AlpacaProvider } from '../../modules/collector/providers/alpaca/alpaca';
import { EvmEventIndexer } from '../../modules/indexer/evm';
import { DefiAdapter } from '../adapter';

export class AlpacaAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.alpaca';

  constructor(configs: AlpacaProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new AlpacaProvider(configs);
    this.indexer = new EvmEventIndexer(providers, configs.lendingPools);
  }
}
