import axios from 'axios';
import BigNumber from 'bignumber.js';

import { normalizeAddress } from '../../../core/helper';
import { ChainConfig } from '../../../core/types';
import { BlockInfo } from '../types';
import AnychainBlockSyncService from './anychain';

class EvmBlockSyncService extends AnychainBlockSyncService {
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
    };
  }

  public async summarizeBlockInfo(blockNumber: number): Promise<BlockInfo> {
    const block = await this.getBlockByNumber(blockNumber);
    const blockInfo: BlockInfo = {
      chain: this.chainConfig.name,
      network: this.chainConfig.network,
      block: block.number,
      timestamp: block.timestamp,
      totalTxn: block.transactions.length,

      uniqueAddress: [],
      volume: 0,
    };

    const addresses: any = {};
    for (let i = 0; i < block.transactions.length; i++) {
      if (!addresses[normalizeAddress(block.transactions[i].from)]) {
        blockInfo.uniqueAddress.push(normalizeAddress(block.transactions[i].from));
        addresses[normalizeAddress(block.transactions[i].from)] = true;
      }
      if (!addresses[normalizeAddress(block.transactions[i].to)]) {
        blockInfo.uniqueAddress.push(normalizeAddress(block.transactions[i].to));
        addresses[normalizeAddress(block.transactions[i].to)] = true;
      }
      blockInfo.volume = new BigNumber(block.transactions[i].value.toString()).dividedBy(1e18).toNumber();
    }

    return blockInfo;
  }
}

export default EvmBlockSyncService;
