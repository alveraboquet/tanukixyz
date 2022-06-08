import { Collection } from 'mongodb';

import { Provider } from '../../core/namespaces';
import { ChainNetwork, CoreData, ShareProviders } from '../../core/types';

export interface BlockInfo {
  chain: string;
  network: ChainNetwork;
  block: number;
  timestamp: number;
  volume: number;
  totalTxn: number;
  uniqueAddress: Array<string>;
}

export interface ChainDateData extends CoreData {
  chain: string;
  network: string;
  date: number;
  transferVolume: number;
  uniqueAddress: number;
  totalTransaction: number;
}

export interface RunCollectorArgv {
  providers: ShareProviders;
  initialBlock: number;
  forceSync: boolean;
}

export interface RunAggregatorArgv {
  providers: ShareProviders;
  initialDate: number;
  forceSync: boolean;
}

export interface IBlockSyncProvider extends Provider {
  // summarize block data
  summarizeBlockInfo: (blockNumber: number) => Promise<any>;

  // start the collector process
  runCollector: (options: RunCollectorArgv) => Promise<any>;

  // start the aggregator process
  runAggregator: (options: RunAggregatorArgv) => Promise<any>;
}

export interface CollectionProps {
  block: Collection;
  daily: Collection;
  date: Collection;
}

export interface CollectorProps {
  chain: string;
  forceSync: boolean;
  initialBlock: number;
}

export interface AggregatorProps {
  // if this value is True, always sync date data from initialDate
  forceSync: boolean;
  initialDate: number;
}
