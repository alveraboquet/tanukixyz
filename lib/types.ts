import { ChainNetwork } from '../configs/types';
import { DatabaseProvider, GraphProvider } from './providers';

export interface Provider {
  name: string;
}

export interface ShareProviders {
  database: DatabaseProvider;
  subgraph: GraphProvider;
}

export interface ContractEventRawData {
  chain: string;
  blockNumber: number;
  timestamp: number;
  transactionId: string; // <txid>:<logIndex>
  contract: string;
  event: string;
  returnValues: any;
}

export interface BlockscanBlockInfo {
  chain: string;
  network: ChainNetwork;
  block: number;
  timestamp: number;
  volume: number;
  totalTxn: number;
  uniqueAddress: Array<string>;
}
