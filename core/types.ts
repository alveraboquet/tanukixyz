import DatabaseProvider from '../providers/database';
import GraphProvider from '../providers/thegraph';

export interface EnvConfig {
  database: {
    name: string;
    connectionUri: string;
    collections: {
      globalState: string;
      globalDataDaily: string;
      globalDataDate: string;
      blockchainBlockSync: string;
    };
  };
  apiKeys: {
    alchemy: string;
    getblock: string;
    moralis: string;
  };
  env: {
    timezone: string;
  };
}

export type ChainFamily = 'bitcore' | 'evm' | 'near' | 'cosmos';
export type ChainNetwork = 'mainnet' | 'testnet';

export interface ChainConfig {
  name: string;
  family: ChainFamily;
  network: ChainNetwork;
  nodeRpcs: {
    default: string; // default query
    archive?: string; // query history data
    event?: string; // used to get contract events
  };
  params?: {
    contractEventQueryBlockRange?: number;
  };
  blockSubgraph?: string;
}

export interface ShareProviders {
  database: DatabaseProvider;
  subgraph: GraphProvider;
}

export interface CoreData {
  module: string;
}
