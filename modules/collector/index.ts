import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { Providers } from './configs';
import { StartCollectorServiceMode } from './providers/collector';

export interface RunCollectorModuleArgv {
  providers: ShareProviders;
  mode: string;
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

      do {
        await provider.startService({
          mode: argv.mode === 'date' ? StartCollectorServiceMode.DATE : StartCollectorServiceMode.DAILY,
          providers: argv.providers,
          initialDate: argv.initialDate,
          forceSync: argv.forceSync,
        });
        if (argv.mode === 'date') await sleep(5 * 60);
      } while (argv.mode === 'date');

      process.exit(0);
    } else {
      // run all
      while (true) {
        for (const [, provider] of Object.entries(Providers)) {
          try {
            await provider.startService({
              mode: argv.mode === 'date' ? StartCollectorServiceMode.DATE : StartCollectorServiceMode.DAILY,
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
