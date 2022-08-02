import { ShareProviders } from '../../lib/types';
import { TraderjoeProtocolConfig, TraderjoeProvider } from '../../modules/collector/providers/traderjoe/traderjoe';
import { DefiAdapter } from '../adapter';
import {EvmEventIndexer} from "../../modules/indexer/evm";

export class TraderJoeAdapter extends DefiAdapter {
  public readonly name: string = 'adapter.traderjoe';

  constructor(configs: TraderjoeProtocolConfig, providers: ShareProviders) {
    super(configs, providers);

    this.collector = new TraderjoeProvider(configs, null);
    this.indexer = new EvmEventIndexer(providers, configs.lending.pools);
  }
}
