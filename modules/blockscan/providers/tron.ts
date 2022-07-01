import { ChainConfig } from '../../../configs/types';
import { BlockscanBlockInfo } from '../../../lib/types';
import BlockscanProvider from './blockscan';

class TronBlockscanProvider extends BlockscanProvider {
  constructor(config: ChainConfig) {
    super(config);
  }

  public async getBlockInfo(blockNumber: number): Promise<BlockscanBlockInfo> {
    const block = await this.chainProvider.getBlockByNumber(blockNumber);
    const blockInfo: BlockscanBlockInfo = {
      chain: this.chainConfig.name,
      network: this.chainConfig.network,
      block: Number(block['block_header']['raw_data']['number']),
      timestamp: Math.floor(Number(block['block_header']['raw_data']['timestamp']) / 1000),
      totalTxn: block.transactions.length,

      uniqueAddress: [],
      volume: 0,
    };

    const foundAddress: any = {};
    for (let txId = 0; txId < block.transactions.length; txId++) {
      const transaction = block.transactions[txId];

      if (transaction['raw_data']['contract']) {
        for (let contractIdx = 0; contractIdx < transaction['raw_data']['contract'].length; contractIdx++) {
          const contractValue = transaction['raw_data']['contract'][contractIdx]['parameter']['value'];
          if (!foundAddress[contractValue['owner_address']]) {
            blockInfo.uniqueAddress.push(contractValue['owner_address']);
            foundAddress[contractValue['owner_address']] = true;
          }
          if (!foundAddress[contractValue['to_address']]) {
            blockInfo.uniqueAddress.push(contractValue['to_address']);
            foundAddress[contractValue['to_address']] = true;
          }

          // transfer TRX
          if (transaction['raw_data']['contract'][contractIdx]['type'] === 'TransferContract') {
            blockInfo.volume += Number(contractValue['amount']) / 1e6;
          }
        }
      }
    }

    return blockInfo;
  }
}

export default TronBlockscanProvider;