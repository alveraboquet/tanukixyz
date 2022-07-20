import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { Registries } from './configs';

export interface RunRegistryModuleArgv {
  providers: ShareProviders;
  protocol: string;
}

class RegistryModule {
  public async run(argv: RunRegistryModuleArgv): Promise<void> {
    if (argv.protocol !== '') {
      const provider = Registries[argv.protocol];
      if (!provider) {
        logger.onError({
          source: 'module.registry',
          message: 'protocol not found',
          props: {
            protocol: argv.protocol,
          },
        });
        process.exit(0);
      }

      while (true) {
        await provider.startService({
          providers: argv.providers,
        });

        await sleep(10 * 60);
      }
    } else {
      // run all
      while (true) {
        for (const [, provider] of Object.entries(Registries)) {
          try {
            await provider.startService({
              providers: argv.providers,
            });
          } catch (e: any) {}
        }

        await sleep(10 * 60);
      }
    }
  }
}

export default new RegistryModule();
