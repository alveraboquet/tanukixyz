import { sleep } from '../lib/helper';
import logger from '../lib/logger';
import { Provider, ShareProviders } from '../lib/types';
import { CollectorProvider } from '../modules/collector/providers/collector';
import { EventIndexerProvider } from '../modules/indexer/provider';

export interface StartDefiProviderProps {
  forceSync: boolean;
  initialDate: number;
}

export class DefiAdapter implements Provider {
  public readonly name: string = 'adapter.defi';

  protected configs: any;
  protected providers: ShareProviders;

  protected collector: CollectorProvider | null;
  protected indexer: Array<EventIndexerProvider>;

  constructor(configs: any, providers: ShareProviders) {
    this.configs = configs;
    this.providers = providers;

    this.collector = null;
    this.indexer = [];
  }

  // implement this function for every defi protocol providers
  public async start(props: StartDefiProviderProps): Promise<any> {
    logger.onInfo({
      source: `adapter.${this.configs.name}`,
      message: `starting ${this.configs.name} adapter`,
      props: {
        protocol: this.configs.name,
        token: this.configs.tokenomics ? this.configs.tokenomics.symbol : null,
      },
    });

    while (true) {
      for (let i = 0; i < this.indexer.length; i++) {
        await this.indexer[i].start({ forceSync: props.forceSync });
      }

      if (this.collector) {
        await this.collector.start({
          forceSync: props.forceSync,
          initialDate: props.initialDate,
          providers: this.providers,
        });
      }

      await sleep(5 * 60);
    }
  }
}
