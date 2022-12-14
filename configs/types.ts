export interface EnvConfig {
  database: {
    name: string;
    connectionUri: string;
    collections: {
      globalState: string;
      globalDataDaily: string;
      globalDataDate: string;
      globalContractEvents: string;
    };
  };
  apiKeys: {
    alchemy: string;
    getblock: string;
    nodereal: string;
  };
  env: {
    timezone: string;
  };
}

export interface SubgraphConfig {
  blockSubgraph: string;
}

export type ChainFamily = 'bitcore' | 'evm' | 'near' | 'tron';
export type ChainNetwork = 'mainnet' | 'testnet';

export interface ChainConfig {
  name: string;
  family: ChainFamily;
  network: ChainNetwork;
  nodeRpcs: {
    default: string; // default query
    archive?: string; // query history data
  };
  subgraph?: SubgraphConfig;
}

export interface TokenConfig {
  symbol: string;
  coingeckoId: string;
  chains: {
    [key: string]: {
      address: string;
      decimals: number;
    };
  };
}

export interface EventIndexConfig {
  chainConfig: ChainConfig;
  contractAbi: any;
  contractAddress: string;
  contractBirthday: number; // block where contract was deployed
  events: Array<string>; // event name to query, ex: Transfer
}

// cToken config - compound.finance liked protocols
export interface CompoundLendingPoolConfig extends EventIndexConfig {
  underlying: TokenConfig;
  underlyingOracle?: string;
}

export interface ProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
}

export interface CompoundProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  pools: Array<CompoundLendingPoolConfig>;
  subgraphs?: Array<{
    chainConfig: ChainConfig;
    lending: string;
  }>;
}

export interface EulerProtocolConfig {
  name: string;
  chainConfig: ChainConfig;
  tokenomics?: TokenConfig;
  graphEndpoint: string;
}

export interface LiquityProtocolConfig {
  name: string;
  chainConfig: ChainConfig;
  tokenomics?: TokenConfig;
  borrowOperation: EventIndexConfig;
  troveManager: EventIndexConfig;
}

export interface UniswapProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraphs: Array<{
    version: 2 | 3;
    chainConfig: ChainConfig;
    exchange: string;
  }>;
}

export interface AaveProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  pools: Array<EventIndexConfig>;
}

export interface BalancerProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraphs: Array<{
    version: 1 | 2;
    chainConfig: ChainConfig;
    exchange: string;
  }>;
}

export type CurvePoolType = 'meta' | 'wrap3Pool' | 'wrap2Btc' | 'aave';
export interface CurvePoolConfig extends EventIndexConfig {
  poolType: CurvePoolType;
  tokens: Array<TokenConfig>;
}
