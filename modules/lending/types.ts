import { Provider } from '../../core/namespaces';
import { ChainConfig, ShareProviders } from '../../core/types';

export interface LendingPool {
  abi: any;
  poolAddress: string;
  genesisBlock: number;
  underlyingSymbol: string;
  underlyingDecimals: number;
  underlyingCoingeckoId: string;
}

export interface LendingConfig {
  name: string;
  configs: Array<{
    chainConfig: ChainConfig;
    birthday: number;
    pools: Array<LendingPool>;
  }>;
}

export interface RunLendingCollectorArgv {
  providers: ShareProviders;
}

export interface RunLendingAggregatorArgv {
  providers: ShareProviders;
  initialDate: number;
  forceSync: boolean;
}
export interface ILendingProvider extends Provider {
  // query last contract events
  getPoolEvents: (
    chainConfig: ChainConfig,
    poolConfig: LendingPool,
    fromBlock: number,
    toBlock: number
  ) => Promise<any>;

  // start the collector process
  runCollector: (options: RunLendingCollectorArgv) => Promise<any>;

  // start the aggregator process
  runAggregator: (options: RunLendingAggregatorArgv) => Promise<any>;
}
