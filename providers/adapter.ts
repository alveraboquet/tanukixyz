import logger from '../lib/logger';
import { Provider, ShareProviders } from '../lib/types';
import { CollectorProvider } from '../modules/collector/collector';
import { EvmEventIndexer } from '../modules/indexer/evm';

export interface StartAdapterProps {
  forceSync: boolean;
  initialDate: number;
}

export class DefiAdapter implements Provider {
  public readonly name: string = 'adapter.defi';

  protected configs: any;
  protected providers: ShareProviders;

  // event indexer service
  protected indexer: EvmEventIndexer | null;

  // protocol metrics collector service
  protected collector: CollectorProvider | null;

  constructor(configs: any, providers: ShareProviders) {
    this.configs = configs;
    this.providers = providers;

    this.collector = null;
    this.indexer = null;
  }

  // implement this function for every defi protocol providers
  public async start(props: StartAdapterProps): Promise<any> {
    logger.onInfo({
      source: `adapter.${this.configs.name}`,
      message: `starting ${this.configs.name} adapter`,
      props: {
        protocol: this.configs.name,
        token: this.configs.tokenomics ? this.configs.tokenomics.symbol : null,
      },
    });

    if (this.indexer) {
      // await this.indexer.start({ forceSync: props.forceSync });
    }

    if (this.collector) {
      await this.collector.start({
        forceSync: props.forceSync,
        initialDate: props.initialDate,
        providers: this.providers,
      });
    }
  }

  public async startIndexer(props: StartAdapterProps): Promise<any> {
    logger.onInfo({
      source: `adapter.${this.configs.name}`,
      message: `starting ${this.configs.name} indexer`,
      props: {
        protocol: this.configs.name,
        token: this.configs.tokenomics ? this.configs.tokenomics.symbol : null,
      },
    });

    if (this.indexer) {
      await this.indexer.start({ forceSync: props.forceSync });
    }
  }

  public async startCollector(props: StartAdapterProps): Promise<any> {
    logger.onInfo({
      source: `adapter.${this.configs.name}`,
      message: `starting ${this.configs.name} collector`,
      props: {
        protocol: this.configs.name,
        token: this.configs.tokenomics ? this.configs.tokenomics.symbol : null,
      },
    });

    if (this.collector) {
      await this.collector.start({
        forceSync: props.forceSync,
        initialDate: props.initialDate,
        providers: this.providers,
      });
    }
  }
}
