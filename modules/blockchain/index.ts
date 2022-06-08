import { sleep } from '../../core/helper';
import logger from '../../core/logger';
import { IModuleService } from '../../core/namespaces';
import { ShareProviders } from '../../core/types';
import { BlockSyncProviders, getChainProviderList } from './providers';

export interface ChainAggregatorArgv {
  providers: ShareProviders;
  initialDate: number;
  forceSync: boolean;
}

export interface ChainCollectorArgv {
  chain: string;
  providers: ShareProviders;
  initialBlock: number;
  forceSync: boolean;
}

class BlockchainModuleService implements IModuleService {
  public async runAggregator(argv: ChainAggregatorArgv): Promise<void> {
    const { providers, initialDate, forceSync } = argv;

    const chains = getChainProviderList();

    while (true) {
      for (let i = 0; i < chains.length; i++) {
        const provider = BlockSyncProviders[chains[i]];
        if (!provider) {
          logger.onDebug({
            source: 'blockchain.module',
            message: 'provider not found',
            props: {
              chain: chains[i],
            },
          });
          continue;
        }

        await provider.runAggregator({
          providers,
          initialDate,
          forceSync,
        });
      }

      await sleep(10 * 60); // sleep 10 minutes
    }
  }

  public async runCollector(argv: ChainCollectorArgv): Promise<void> {
    const { chain, providers, initialBlock, forceSync } = argv;

    // support sync one chain per process only!!!
    const provider = BlockSyncProviders[chain];
    if (!provider) {
      console.info('module:blockchain unsupported chain');
      process.exit(0);
    }

    while (true) {
      await provider.runCollector({
        providers,
        initialBlock,
        forceSync,
      });

      await sleep(120); // sleep 2 minutes
    }
  }

  runTester(argv: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}

export default new BlockchainModuleService();
