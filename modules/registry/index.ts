import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { Registries } from './configs';

export interface RunRegistryModuleArgv {
  providers: ShareProviders;
  protocol: string;
  initialTime: number;
  forceSync: boolean;
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

      await provider.startService({
        providers: argv.providers,
        initialTime: argv.initialTime,
        forceSync: argv.forceSync,
      });

      process.exit(0);
    } else {
      // run all
      while (true) {
        for (const [, provider] of Object.entries(Registries)) {
          try {
            await provider.startService({
              providers: argv.providers,
              initialTime: argv.initialTime,
              forceSync: argv.forceSync,
            });
          } catch (e: any) {}
        }

        await sleep(5 * 60);
      }
    }
  }
}

export default new RegistryModule();
