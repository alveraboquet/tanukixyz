import { ChainConfig } from '../../core/types';

export interface IndexConfig {
  chainConfig: ChainConfig;
  contractAbi: any;
  contractAddress: string;
  contractBirthday: number;
  events: Array<string>;
}

export interface EventRawData {
  chain: string;
  blockNumber: number;
  timestamp: number;
  transactionId: string; // <txid>:<logIndex>
  contract: string;
  event: string;
  returnValues: any;
}
