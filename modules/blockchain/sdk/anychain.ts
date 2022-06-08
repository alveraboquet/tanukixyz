import { Blockchains } from '../../../core/constants/chains';
import envConfig from '../../../core/env';
import { getTodayUTCTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { IChainProvider } from '../../../core/namespaces';
import { ChainConfig } from '../../../core/types';
import { EvmChainProvider } from '../../../providers';
import { BitcoreChainProvider, NearChainProvider } from '../../../providers/blockchain';
import { InitialBlockSync } from '../configs';
import * as helpers from '../helpers';
import { BlockInfo, ChainDateData, IBlockSyncProvider, RunAggregatorArgv, RunCollectorArgv } from '../types';

class AnychainBlockSyncService implements IBlockSyncProvider {
  public readonly name: string = 'anychain.provider';
  public readonly chainConfig: ChainConfig;
  public readonly chainProvider: IChainProvider;

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
      default: {
        this.chainProvider = new EvmChainProvider({ rpc: this.chainConfig.nodeRpcs.default });
      }
    }
  }

  // need to override this function
  public async summarizeBlockInfo(blockNumber: number): Promise<BlockInfo | null> {
    return null;
  }

  public async runCollector(options: RunCollectorArgv): Promise<void> {
    const { providers, initialBlock, forceSync } = options;

    const blockCollection = await providers.database.getCollection(envConfig.database.collections.blockchainBlockSync);
    blockCollection.createIndex({ chain: 1, network: 1, block: 1 }, { background: true });
    blockCollection.createIndex({ chain: 1, network: 1, timestamp: 1 }, { background: true });
    blockCollection.createIndex({ timestamp: 1 }, { background: true });

    let startBlock = initialBlock;
    if (!forceSync) {
      // load default config
      if (InitialBlockSync[this.chainConfig.name] && InitialBlockSync[this.chainConfig.name] > startBlock) {
        startBlock = InitialBlockSync[this.chainConfig.name];
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

      const blockInfo = await this.summarizeBlockInfo(startBlock);
      if (blockInfo) {
        await blockCollection.updateOne(
          {
            chain: this.chainConfig.name,
            network: 'mainnet',
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
        message: 'synced chain block',
        props: {
          chain: this.chainConfig.name,
          network: 'mainnet',
          blockNumber: startBlock,
          elapsed: `${elapsed.toFixed(2)}s`,
        },
      });

      startBlock += 1;
    }
  }

  public async runAggregator(options: RunAggregatorArgv): Promise<void> {
    const { providers, initialDate, forceSync } = options;

    const blockCollection = await providers.database.getCollection(envConfig.database.collections.blockchainBlockSync);
    const dailyDataCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDaily);
    const dateDataCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    // firstly, we need to update daily data
    const dailyData: ChainDateData = await helpers.summarizeBlockDataDaily(this.chainConfig, {
      block: blockCollection,
      daily: dailyDataCollection,
      date: dateDataCollection,
    });

    if (dailyData) {
      await dailyDataCollection.updateOne(
        {
          module: dailyData.module,
          chain: dailyData.chain,
          network: dailyData.network,
        },
        {
          $set: {
            ...dailyData,
          },
        },
        {
          upsert: true,
        }
      );
    }
    logger.onInfo({
      source: this.name,
      message: 'updated chain daily data',
      props: {
        chain: dailyData.chain,
      },
    });

    // secondly, we need to update date data
    // we update from the latest date in database or initialDate value
    const today = getTodayUTCTimestamp();
    let startDate = initialDate === 0 ? today : initialDate;
    if (!forceSync) {
      const documents = await dateDataCollection
        .find({
          module: 'blockchain',
          chain: this.chainConfig.name,
          network: this.chainConfig.network,
        })
        .sort({ date: -1 })
        .limit(1)
        .toArray();
      if (documents.length > 0) {
        startDate = documents[0].date;
      }
    }

    while (startDate <= today) {
      const dateData: ChainDateData = await helpers.summarizeBlockDataDate(
        this.chainConfig,
        {
          block: blockCollection,
          daily: dailyDataCollection,
          date: dateDataCollection,
        },
        startDate
      );

      if (dateData) {
        await dateDataCollection.updateOne(
          {
            module: dateData.module,
            chain: dateData.chain,
            network: dateData.network,
            date: startDate,
          },
          {
            $set: {
              ...dateData,
            },
          },
          {
            upsert: true,
          }
        );
      }

      logger.onInfo({
        source: this.name,
        message: 'updated chain date data',
        props: {
          chain: dailyData.chain,
          date: new Date(startDate * 1000).toISOString().split('T')[0],
        },
      });

      startDate += 24 * 60 * 60;
    }
  }
}

export default AnychainBlockSyncService;
