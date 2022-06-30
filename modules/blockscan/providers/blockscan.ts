import envConfig from '../../../configs/env';
import { ChainConfig } from '../../../configs/types';
import logger from '../../../lib/logger';
import { ChainProvider } from '../../../lib/providers';
import {
  BitcoreChainProvider,
  EvmChainProvider,
  NearChainProvider,
  TronChainProvider,
} from '../../../lib/providers/blockchain';
import { BlockscanBlockInfo, Provider, ShareProviders } from '../../../lib/types';
import { InitialBlockscanSync } from '../constants';

export interface StartBlockscanProviderProps {
  providers: ShareProviders;
  initialBlock: number;
  forceSync: boolean;
}

class BlockscanProvider implements Provider {
  public readonly name: string = 'provider.blockscan';
  public readonly chainConfig: ChainConfig;
  public readonly chainProvider: ChainProvider;

  constructor(config: ChainConfig) {
    this.chainConfig = config;

    switch (this.chainConfig.family) {
      case 'bitcore': {
        this.chainProvider = new BitcoreChainProvider({ rpc: this.chainConfig.nodeRpcs.default });
        break;
      }
      case 'near': {
        this.chainProvider = new NearChainProvider({ rpc: this.chainConfig.nodeRpcs.default });
        break;
      }
      case 'tron': {
        this.chainProvider = new TronChainProvider({ rpc: this.chainConfig.nodeRpcs.default });
        break;
      }
      default: {
        this.chainProvider = new EvmChainProvider({ rpc: this.chainConfig.nodeRpcs.default });
      }
    }
  }

  // need to override this function
  public async getBlockInfo(blockNumber: number): Promise<BlockscanBlockInfo | null> {
    return null;
  }

  public async start(options: StartBlockscanProviderProps): Promise<void> {
    const { providers, initialBlock, forceSync } = options;

    const blockCollection = await providers.database.getCollection(
      envConfig.database.collections.globalBlockscanBlocks
    );
    blockCollection.createIndex({ chain: 1, network: 1, block: 1 }, { background: true });
    blockCollection.createIndex({ chain: 1, network: 1, timestamp: 1 }, { background: true });
    blockCollection.createIndex({ timestamp: 1 }, { background: true });

    let startBlock = initialBlock;
    if (!forceSync) {
      // load default config
      if (InitialBlockscanSync[this.chainConfig.name] && InitialBlockscanSync[this.chainConfig.name] > startBlock) {
        startBlock = InitialBlockscanSync[this.chainConfig.name];
      }

      // we need to find the latest block in database
      const blockSynced = await blockCollection
        .find({
          chain: this.chainConfig.name,
          network: 'mainnet',
        })
        .sort({ block: -1 })
        .limit(1)
        .toArray();
      if (blockSynced.length > 0) {
        startBlock = blockSynced[0].block;
      }
    }

    const latestBlockNumber = await this.chainProvider.getLatestBlockNumber();
    while (startBlock <= latestBlockNumber) {
      const startExeTime = new Date().getTime();

      try {
        const blockInfo = await this.getBlockInfo(startBlock);
        if (blockInfo) {
          await blockCollection.updateOne(
            {
              chain: this.chainConfig.name,
              network: this.chainConfig.network,
              block: startBlock,
            },
            {
              $set: {
                ...blockInfo,
              },
            },
            {
              upsert: true,
            }
          );
        }

        const endExeTime = new Date().getTime();
        const elapsed = (endExeTime - startExeTime) / 1000;
        logger.onInfo({
          source: this.name,
          message: 'collected block info',
          props: {
            chain: this.chainConfig.name,
            network: this.chainConfig.network,
            blockNumber: startBlock,
            elapsed: `${elapsed.toFixed(2)}s`,
          },
        });
      } catch (e: any) {
        logger.onWarn({
          source: this.name,
          message: 'failed to collect block info, skipped it',
          props: {
            chain: this.chainConfig.name,
            network: this.chainConfig.network,
            blockNumber: startBlock,
          },
        });
      }

      startBlock += 1;
    }
  }
}

export default BlockscanProvider;
