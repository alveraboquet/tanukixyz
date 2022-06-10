import { sleep } from '../../core/helper';
import { IModuleService } from '../../core/namespaces';
import { ShareProviders } from '../../core/types';
import { LendingProviders, getLendingProviderList } from './providers';

interface RunLendingCollectorArgv {
  providers: ShareProviders;
  project: string;
}

class LendingModuleService implements IModuleService {
  public async runAggregator(argv: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async runCollector(argv: RunLendingCollectorArgv): Promise<any> {
    if (argv.project !== '') {
      const provider = LendingProviders[argv.project];
      if (provider) {
        while (true) {
          await provider.runCollector({
            providers: argv.providers,
          });

          await sleep(10 * 60); // sleep 10 minutes
        }
      } else {
        console.info(`module:lending project ${argv.project} not found`);
      }
    } else {
      // collector all projects
      const providers = getLendingProviderList();
      while (true) {
        for (let i = 0; i < providers.length; i++) {
          const provider = LendingProviders[providers[i]];
          if (provider) {
            await provider.runCollector({
              providers: argv.providers,
            });
          }
        }

        await sleep(10 * 60); // sleep 10 minutes
      }
    }
  }

  public async runTester(argv: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}

export default new LendingModuleService();
