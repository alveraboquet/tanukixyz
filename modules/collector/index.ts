import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { Providers } from './configs';

export interface RunCollectorModuleArgv {
  providers: ShareProviders;
  protocol: string;
  initialDate: number;
  forceSync: boolean;
}

class CollectorModule {
  public async run(argv: RunCollectorModuleArgv): Promise<void> {
    if (argv.protocol !== '') {
      const provider = Providers[argv.protocol];
      if (!provider) {
        logger.onError({
          source: 'module.collector',
          message: 'protocol not found',
          props: {
            protocol: argv.protocol,
          },
        });
        process.exit(0);
      }

      await provider.startService({
        providers: argv.providers,
        initialDate: argv.initialDate,
        forceSync: argv.forceSync,
      });
    } else {
      // run all
      while (true) {
        for (const [, provider] of Object.entries(Providers)) {
          try {
            await provider.startService({
              providers: argv.providers,
              initialDate: argv.initialDate,
              forceSync: argv.forceSync,
            });
          } catch (e: any) {}
        }

        await sleep(5 * 60);
      }
    }
  }
}

export default new CollectorModule();
