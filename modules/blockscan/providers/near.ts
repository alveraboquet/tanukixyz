import BigNumber from 'bignumber.js';

import { ChainConfig } from '../../../configs/types';
import { BlockscanBlockInfo } from '../../../lib/types';
import BlockscanProvider from './blockscan';

class NearBlockscanProvider extends BlockscanProvider {
  constructor(config: ChainConfig) {
    super(config);
  }

  public async getBlockInfo(blockNumber: number): Promise<BlockscanBlockInfo> {
    const block = await this.chainProvider.getBlockByNumber(blockNumber);
    const blockInfo: BlockscanBlockInfo = {
      chain: this.chainConfig.name,
      blockNumber: Number(block.header.height),
      blockTime: Math.floor(block.header.timestamp / 1e9),
      transactionCount: block.transactions.length,

      addressList: [],
      transferVolume: 0,
    };

    const foundAddress: any = {};
    for (let txId = 0; txId < block.transactions.length; txId++) {
      const transaction = block.transactions[txId];
      if (!foundAddress[transaction['signer_id']] && transaction['signer_id']) {
        blockInfo.addressList.push(transaction['signer_id']);
        blockInfo.addressList.push(transaction['signer_id']);
        foundAddress[transaction['signer_id']] = true;
      }
      if (!foundAddress[transaction['receiver_id']] && transaction['receiver_id']) {
        blockInfo.addressList.push(transaction['receiver_id']);
        blockInfo.addressList.push(transaction['receiver_id']);
        foundAddress[transaction['receiver_id']] = true;
      }

      // count volume
      if (transaction.actions && transaction.actions.length > 0) {
        const actions = transaction.actions;
        for (let actionId = 0; actionId < actions.length; actionId++) {
          if (actions[actionId]['Transfer']) {
            blockInfo.transferVolume += new BigNumber(actions[actionId]['Transfer']['deposit'].toString())
              .dividedBy(1e24)
              .toNumber();
          }
        }
      }
    }

    return blockInfo;
  }
}

export default NearBlockscanProvider;
