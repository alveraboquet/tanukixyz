import { ChainConfig } from '../../../configs/types';
import { sleep } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { BitcoreChainProvider } from '../../../lib/providers/blockchain';
import { BlockscanBlockInfo } from '../../../lib/types';
import BlockscanProvider from './blockscan';

class LitecoreBlockscanProvider extends BlockscanProvider {
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
          if (outputs[outIdx].scriptPubKey.addresses) {
            for (let addrIdx = 0; addrIdx < outputs[outIdx].scriptPubKey.addresses.length; addrIdx++) {
              if (!addresses[outputs[outIdx].scriptPubKey.addresses[addrIdx]]) {
                blockInfo.addressList.push(outputs[outIdx].scriptPubKey.addresses[addrIdx]);
                addresses[outputs[outIdx].scriptPubKey.addresses[addrIdx]] = true;
              }
            }
          }
          blockInfo.transferVolume += outputs[outIdx].value;
        }
      }
    }

    return blockInfo;
  }
}

export default LitecoreBlockscanProvider;
