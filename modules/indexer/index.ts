import { normalizeAddress, sleep } from '../../core/helper';
import logger from '../../core/logger';
import { ShareProviders } from '../../core/types';
import IndexConfigs from './constants';
import { EventIndexerProvider } from './provider';
import { IndexConfig } from './types';

export interface RunIndexerArgv {
  providers: ShareProviders;
  project: string;
}

class IndexerModule {
  public async run(argv: RunIndexerArgv): Promise<void> {
    if (argv.project !== '') {
      const configs = IndexConfigs[argv.project];
      if (!configs) {
        logger.onError({
          source: 'module.indexer',
          message: 'project not found',
          props: {
            project: argv.project,
          },
        });
        process.exit(0);
      }

      while (true) {
        for (let i = 0; i < configs.length; i++) {
          await IndexerModule.startWithConfig(argv.providers, configs[i]);
        }

        await sleep(60);
      }
    } else {
      while (true) {
        for (const [, configs] of Object.entries(IndexConfigs)) {
          for (let i = 0; i < configs.length; i++) {
            await IndexerModule.startWithConfig(argv.providers, configs[i]);
          }
        }

        await sleep(60);
      }
    }
  }

  private static async startWithConfig(providers: ShareProviders, config: IndexConfig): Promise<void> {
    logger.onInfo({
      source: 'module.indexer',
      message: 'start events indexer service',
      props: {
        chain: config.chainConfig.name,
        contract: normalizeAddress(config.contractAddress),
        events: config.events.toString(),
      },
    });
    const provider: EventIndexerProvider = new EventIndexerProvider(providers, config);
    await provider.start({});
  }
}

export default new IndexerModule();
