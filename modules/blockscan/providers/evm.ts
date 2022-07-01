import axios from 'axios';
import BigNumber from 'bignumber.js';

import { ChainConfig } from '../../../configs/types';
import { normalizeAddress } from '../../../lib/helper';
import { BlockscanBlockInfo } from '../../../lib/types';
import BlockscanProvider from './blockscan';

class EvmBlockscanProvider extends BlockscanProvider {
  constructor(config: ChainConfig) {
    super(config);
  }

  // web3 library failed to get data from Binance Smart Chain when get full block data (include transaction objects)
  public async getBlockByNumber(blockNumber: number): Promise<any> {
    const block = (
      await axios.post(
        this.chainConfig.nodeRpcs.default,
        {
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [`0x${Number(blockNumber).toString(16)}`, true],
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    ).data.result;

    return {
      number: parseInt(block.number.toString(), 16),
      hash: block.hash,
      timestamp: parseInt(block.timestamp.toString(), 16),
      transactions: block.transactions,

      baseFeePerGas: block.baseFeePerGas ? parseInt(block.baseFeePerGas.toString(), 16).toString() : null,
      gasUsed: parseInt(block.gasUsed.toString(), 16).toString(),
    };
  }

  public async getBlockInfo(blockNumber: number): Promise<BlockscanBlockInfo> {
    const block = await this.getBlockByNumber(blockNumber);
    const blockInfo: BlockscanBlockInfo = {
      chain: this.chainConfig.name,
      blockNumber: block.number,
      blockTime: block.timestamp,
      transactionCount: block.transactions.length,

      addressList: [],
      transferVolume: 0,
    };

    const addresses: any = {};
    for (let i = 0; i < block.transactions.length; i++) {
      if (!addresses[normalizeAddress(block.transactions[i].from)]) {
        blockInfo.addressList.push(normalizeAddress(block.transactions[i].from));
        addresses[normalizeAddress(block.transactions[i].from)] = true;
      }
      if (!addresses[normalizeAddress(block.transactions[i].to)]) {
        blockInfo.addressList.push(normalizeAddress(block.transactions[i].to));
        addresses[normalizeAddress(block.transactions[i].to)] = true;
      }
      blockInfo.transferVolume += new BigNumber(block.transactions[i].value.toString()).dividedBy(1e18).toNumber();
    }

    if (block.baseFeePerGas && block.gasUsed) {
      blockInfo.burntFees = new BigNumber(block.baseFeePerGas)
        .multipliedBy(new BigNumber(block.gasUsed))
        .dividedBy(1e18)
        .toNumber();
    }

    return blockInfo;
  }
}

export default EvmBlockscanProvider;
