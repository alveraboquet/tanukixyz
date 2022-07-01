import { ChainConfig } from '../../../configs/types';
import { sleep } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { BitcoreChainProvider } from '../../../lib/providers/blockchain';
import { BlockscanBlockInfo } from '../../../lib/types';
import BlockscanProvider from './blockscan';

class BitcoreBlockscanProvider extends BlockscanProvider {
  constructor(config: ChainConfig) {
    super(config);
  }

  public async getBlockInfo(blockNumber: number): Promise<BlockscanBlockInfo> {
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

    const blockInfo: BlockscanBlockInfo = {
      chain: this.chainConfig.name,
      blockNumber: block.height,
      blockTime: block.time,
      transactionCount: block.tx.length,

      addressList: [],
      transferVolume: 0,
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
            blockInfo.addressList.push(outputs[outIdx].scriptPubKey.address);
            addresses[outputs[outIdx].scriptPubKey.address] = true;
          }
          blockInfo.transferVolume += outputs[outIdx].value;
        }
      }
    }

    return blockInfo;
  }
}

export default BitcoreBlockscanProvider;
