import { sleep } from '../../core/helper';
import { IModuleService } from '../../core/namespaces';
import { ShareProviders } from '../../core/types';
import { CoinList } from './constants';
import CryptoProvider from './providers/crypto';
import StockProvider from './providers/stock';
import { CoinType, IDominanceProvider } from './types';

interface RunDominanceAggregatorArgv {
  providers: ShareProviders;
  initialDate: number;
  forceSync: boolean;
}

class DominanceModuleService implements IModuleService {
  public async runAggregator(argv: RunDominanceAggregatorArgv): Promise<any> {
    let provider: IDominanceProvider;
    for (let i = 0; i < CoinList.length; i++) {
      if (CoinList[i].type === CoinType.STOCK) {
        provider = new StockProvider(CoinList[i], argv.providers);
      } else {
        provider = new CryptoProvider(CoinList[i], argv.providers);
      }

      await provider.runAggregator({
        initialDate: argv.initialDate,
        forceSync: argv.forceSync,
      });
    }

    await sleep(20 * 60); // 20 minutes
  }

  runCollector(argv: any): any {
    // unused function
  }

  runTester(argv: any): any {
    // unused function
  }
}

export default new DominanceModuleService();
