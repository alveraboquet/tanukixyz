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
  blockNumber: number;
  blockTime: number;
  transferVolume: number;
  transactionCount: number;
  addressList: Array<string>;

  miner?: string;
  collectedFees?: number;
  burntFees?: number;
}

export interface RegistryTransactionData {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  protocol: string;
  chain: string;

  // protocol data
  breakdown?: any;
}

export interface RegistryAddressData {
  // index
  chain: string;
  address: string;
  protocol: string;
  timestamp: number;

  breakdown?: any;
}
