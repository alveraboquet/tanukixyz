import { EventIndexConfig } from '../../../configs/types';
import { ContractEventRawData, Provider, ShareProviders } from '../../../lib/types';

export class EventIndexerHook implements Provider {
  public readonly name: string = 'hook.indexer';

  public readonly protocol: string;
  public readonly providers: ShareProviders;
  public readonly configs: EventIndexConfig;

  constructor(protocol: string, providers: ShareProviders, configs: EventIndexConfig) {
    this.protocol = protocol;
    this.providers = providers;
    this.configs = configs;
  }

  // child class should override this function
  // for addition events processing steps
  public async processEvents(allEvents: Array<ContractEventRawData>): Promise<void> {}
}
