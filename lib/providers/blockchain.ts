import axios from 'axios';
import Web3 from 'web3';

import envConfig from '../../configs/env';
import logger from '../logger';
import { Provider } from '../types';

export interface ChainProviderOptions {
  rpc: string;
}

export class ChainProvider implements Provider {
  public readonly name: string = 'provider.chain';

  _rpc: string;

  constructor(options: ChainProviderOptions) {
    this._rpc = options.rpc;
  }

  public async getLatestBlockNumber(): Promise<number> {
    // implement chain logic
    return 0;
  }

  public async getBlockByNumber(blockNumber: number): Promise<any> {
    // implement chain logic
    return null;
  }
}

export class EvmChainProvider extends ChainProvider {
  private _web3: Web3;

  constructor(options: ChainProviderOptions) {
    super(options);

    // setup web3 instance
    this._web3 = new Web3(this._rpc);
  }

  public async getLatestBlockNumber(): Promise<number> {
    return await this._web3.eth.getBlockNumber();
  }

  public async getBlockByNumber(blockNumber: number): Promise<any> {
    return await this._web3.eth.getBlock(blockNumber);
  }
}

export class BitcoreChainProvider extends ChainProvider {
  constructor(options: ChainProviderOptions) {
    super(options);
  }

  public async getLatestBlockNumber(): Promise<number> {
    const getBlockApiKey = envConfig.apiKeys.getblock;
    const chainInfo = await axios.get(`${this._rpc}/chaininfo.json`, {
      headers: {
        'x-api-key': getBlockApiKey || '',
        'Content-Type': 'application/json',
      },
    });
    if (chainInfo.data) {
      return chainInfo.data.blocks;
    } else {
      logger.onWarn({
        source: this.name,
        message: 'getblock api unexpected return data',
        props: {
          endpoint: `${this._rpc}/chaininfo.json`,
          key: getBlockApiKey,
        },
      });
      return 0;
    }
  }

  public async getBlockByNumber(blockNumber: number): Promise<any> {
    const getBlockApiKey = envConfig.apiKeys.getblock;
    const blockhash = (
      await axios.get(`${this._rpc}/blockhashbyheight/${blockNumber}.json`, {
        headers: {
          'x-api-key': getBlockApiKey || '',
          'Content-Type': 'application/json',
        },
      })
    ).data.blockhash;
    const response = await axios.get(`${this._rpc}/block/${blockhash}.json`, {
      headers: {
        'x-api-key': getBlockApiKey || '',
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
    return response.data;
  }
}

export class NearChainProvider extends ChainProvider {
  constructor(options: ChainProviderOptions) {
    super(options);
  }

  public async getLatestBlockNumber(): Promise<number> {
    const response = await axios.post(
      this._rpc,
      {
        jsonrpc: '2.0',
        id: '1',
        method: 'block',
        params: {
          finality: 'final',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return Number(response.data.result.header.height);
  }

  public async getBlockByNumber(blockNumber: number): Promise<any> {
    const response = await axios.post(
      this._rpc,
      {
        jsonrpc: '2.0',
        id: '1',
        method: 'block',
        params: {
          block_id: blockNumber,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const blockInfo = response.data.result;
    blockInfo.transactions = [];

    for (let i = 0; i < blockInfo.chunks.length; i++) {
      const response = await axios.post(
        this._rpc,
        {
          jsonrpc: '2.0',
          id: '1',
          method: 'chunk',
          params: {
            chunk_id: blockInfo.chunks[i]['chunk_hash'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const txs = response.data.result.transactions;
      blockInfo.transactions = blockInfo.transactions.concat(txs);
    }

    return blockInfo;
  }
}

// use tron grid API
export class TronChainProvider extends ChainProvider {
  constructor(options: ChainProviderOptions) {
    super(options);
  }

  public async getLatestBlockNumber(): Promise<number> {
    const response = await axios.get(`${this._rpc}/wallet/getnowblock`);
    return Number(response.data['block_header']['raw_data']['number']);
  }

  public async getBlockByNumber(blockNumber: number): Promise<any> {
    const response = await axios.post(
      `${this._rpc}/wallet/getblockbynum`,
      {
        num: blockNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}
