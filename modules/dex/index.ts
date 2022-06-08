import { sleep } from '../../core/helper';
import { IModuleService } from '../../core/namespaces';
import { ShareProviders } from '../../core/types';
import { DexProviders } from './projects';
import { IDexProvider } from './types';

function getDexList() {
  const DexLists: Array<string> = [];
  for (const [key] of Object.entries(DexProviders)) {
    DexLists.push(key);
  }
  return DexLists;
}

export interface RunTesterArgv {
  project: string;
}

export interface RunAggregatorArgv {
  providers: ShareProviders;
  project: string;
  initialDate: number;
  forceSync: boolean;
}

class DexModuleService implements IModuleService {
  public async runAggregator(argv: RunAggregatorArgv): Promise<any> {
    if (argv.project == '') {
      const projectList = getDexList();
      while (true) {
        for (let i = 0; i < projectList.length; i++) {
          const provider: IDexProvider = DexProviders[projectList[i]] as IDexProvider;
          await provider.runAggregator({
            providers: argv.providers,
            initialDate: argv.initialDate,
            forceSync: argv.forceSync,
          });
        }

        await sleep(10 * 60); // 10 minutes
      }
    } else {
      const provider = DexProviders[argv.project];

      if (!provider) {
        console.info(`module:dex project not found`);
        process.exit(0);
      }
      await provider.runAggregator({
        providers: argv.providers,
        initialDate: argv.initialDate,
        forceSync: argv.forceSync,
      });
    }
  }

  public async runCollector(argv: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async runTester(argv: RunTesterArgv): Promise<any> {
    if (argv.project == '') {
      const projectList = getDexList();
      for (let i = 0; i < projectList.length; i++) {
        const provider: IDexProvider = DexProviders[projectList[i]] as IDexProvider;
        await provider.runTest();
      }
    } else {
      const provider = DexProviders[argv.project];

      if (!provider) {
        console.info(`module:dex project not found`);
        process.exit(0);
      }
      await provider.runTest();
    }
  }
}

export default new DexModuleService();
