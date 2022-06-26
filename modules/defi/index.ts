import { sleep } from '../../core/helper';
import logger from '../../core/logger';
import { ShareProviders } from '../../core/types';
import { Providers } from './constants';

export interface RunDefiModuleArgv {
  providers: ShareProviders;
  project: string;
  initialDate: number;
  forceSync: boolean;
}

class DefiModule {
  public async run(argv: RunDefiModuleArgv): Promise<void> {
    if (argv.project !== '') {
      const provider = Providers[argv.project];
      if (!provider) {
        logger.onError({
          source: 'module.defi',
          message: 'project not found',
          props: {
            project: argv.project,
          },
        });
        process.exit(0);
      }

      while (true) {
        await provider.startService({
          providers: argv.providers,
          initialDate: argv.initialDate,
          forceSync: argv.forceSync,
        });

        await sleep(5 * 60);
      }
    } else {
      // run all
      while (true) {
        for (const [, provider] of Object.entries(Providers)) {
          await provider.startService({
            providers: argv.providers,
            initialDate: argv.initialDate,
            forceSync: argv.forceSync,
          });
        }

        await sleep(5 * 60);
      }
    }
  }
}

export default new DefiModule();
