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
