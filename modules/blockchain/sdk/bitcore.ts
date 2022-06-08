import { sleep } from '../../../core/helper';
import logger from '../../../core/logger';
import { ChainConfig } from '../../../core/types';
import { BitcoreChainProvider } from '../../../providers/blockchain';
import { BlockInfo } from '../types';
import AnychainBlockSyncService from './anychain';

class BitcoreBlockSyncService extends AnychainBlockSyncService {
  constructor(config: ChainConfig) {
    super(config);
  }

  public async summarizeBlockInfo(blockNumber: number): Promise<BlockInfo> {
    const chainProvider = new BitcoreChainProvider({
      rpc: this.chainConfig.nodeRpcs.default,
    });

    let block: any | null = null;
    while (!block) {
      try {
        block = await chainProvider.getBlockByNumber(blockNumber);
      } catch (e: any) {
        logger.onWarn({
          source: this.name,
          message: 'failed to get block data',
          props: {
            chain: this.chainConfig.name,
            block: blockNumber,
            error: e.message,
          },
        });
      }

      await sleep(10); // sleep 10 seconds until the next try
    }

    const blockInfo: BlockInfo = {
      chain: this.chainConfig.name,
      network: this.chainConfig.network,
      block: block.height,
      timestamp: block.time,
      totalTxn: block.tx.length,

      uniqueAddress: [],
      volume: 0,
    };

    const addresses: any = {};
    for (let i = 0; i < block.tx.length; i++) {
      const transaction = block.tx[i];

      // process vin
      const coinbaseTx = !!transaction.vin[0].coinbase;
      if (!coinbaseTx) {
        const outputs = transaction.vout;
        for (let outIdx = 0; outIdx < outputs.length; outIdx++) {
          if (outputs[outIdx].scriptPubKey.address && !addresses[outputs[outIdx].scriptPubKey.address]) {
            blockInfo.uniqueAddress.push(outputs[outIdx].scriptPubKey.address);
            addresses[outputs[outIdx].scriptPubKey.address] = true;
          }
          blockInfo.volume += outputs[outIdx].value;
        }
      }
    }

    return blockInfo;
  }
}

export default BitcoreBlockSyncService;
