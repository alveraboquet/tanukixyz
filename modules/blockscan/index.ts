import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { BlockscanProviderConfigs } from './configs';

export interface RunBlockscanArgv {
  providers: ShareProviders;
  chain: string;
  initialBlock: number;
  forceSync: boolean;
}

class BlockscanModule {
  public async run(argv: RunBlockscanArgv): Promise<void> {
    const { providers, chain, initialBlock, forceSync } = argv;

    let provider: any;
    if (chain !== '') {
      provider = BlockscanProviderConfigs[chain];
    } else {
      provider = BlockscanProviderConfigs['ethereum'];
    }

    if (!provider) {
      logger.onError({
        source: 'module.blockscan',
        message: 'chain not found',
        props: {
          chain: chain,
        },
      });
      process.exit(0);
    }

    while (true) {
      await provider.start({ providers, initialBlock, forceSync });
      await sleep(60);
    }
  }
}

export default new BlockscanModule();
