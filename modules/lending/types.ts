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

export interface AaveLendingPoolConfig {
  abi: any;
  address: string;
  genesisBlock: number;
}

export interface LendingConfig {
  name: string;
  configs: Array<{
    chainConfig: ChainConfig;
    birthday: number;

    // compound-liked lendings use separate lending pool for every asset
    // this config used for both compound-liked and aave-liked lendings
    pools: Array<LendingPool>;

    // aave-liked lendings use single entry lending pool for all assets
    // this config used for aave liked lendings only
    lendingPool?: AaveLendingPoolConfig;
  }>;
}

export interface LendingData {
  supplyVolumeUSD: number;
  withdrawVolumeUSD: number;
  borrowVolumeUSD: number;
  repayVolumeUSD: number;
  liquidityUSD?: number;
  addressCount: number;
  transactionCount: number;
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
  getPoolEvents: (props: any) => Promise<any>;

  // get the liquidity locked in contract
  getLiquidityLocked?: (props: any) => Promise<any>;

  // start the collector process
  runCollector: (options: RunLendingCollectorArgv) => Promise<any>;

  // start the aggregator process
  runAggregator: (options: RunLendingAggregatorArgv) => Promise<any>;
}
