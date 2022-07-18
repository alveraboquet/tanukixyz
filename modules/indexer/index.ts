import { EventIndexConfig } from '../../configs/types';
import { normalizeAddress, sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import IndexConfigs from './configs';
import { getHook } from './hooks';
import IndexerHook from './hooks/hook';
import { EventIndexerProvider } from './provider';

export interface RunIndexerArgv {
  providers: ShareProviders;
  protocol: string;
  forceSync: boolean;
}

class IndexerModule {
  public async run(argv: RunIndexerArgv): Promise<void> {
    if (argv.protocol !== '') {
      const configs = IndexConfigs[argv.protocol];
      if (!configs) {
        logger.onError({
          source: 'module.indexer',
          message: 'protocol not found',
          props: {
            project: argv.protocol,
          },
        });
        process.exit(0);
      }

      while (true) {
        for (let i = 0; i < configs.length; i++) {
          await IndexerModule.startWithConfig(argv, configs[i]);
        }

        await sleep(60);
      }
    } else {
      while (true) {
        for (const [, configs] of Object.entries(IndexConfigs)) {
          for (let i = 0; i < configs.length; i++) {
            await IndexerModule.startWithConfig(argv, configs[i]);
          }
        }

        await sleep(60);
      }
    }
  }

  private static async startWithConfig(argv: RunIndexerArgv, config: EventIndexConfig): Promise<void> {
    const { providers, protocol, forceSync } = argv;

    logger.onInfo({
      source: 'module.indexer',
      message: 'start events indexer service',
      props: {
        chain: config.chainConfig.name,
        contract: normalizeAddress(config.contractAddress),
        events: config.events.toString(),
      },
    });

    const hook: IndexerHook | null = getHook(protocol, providers, config);
    const provider: EventIndexerProvider = new EventIndexerProvider(providers, config, hook);
    await provider.start({ forceSync });
  }
}

export default new IndexerModule();
