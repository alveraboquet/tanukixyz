import { Provider } from '../../core/namespaces';
import { CoreData, ShareProviders } from '../../core/types';

export interface DexSubgraphConfig {
  blocks: string;
  exchange: string;
}

export interface DexConfig {
  name: string;
  birthday: number;
  subgraph: Array<DexSubgraphConfig>;
}

export interface DexDateData extends CoreData {
  date: number;
  name: string;
  feeUSD: number;
  volumeUSD: number;
  allTimeVolumeUSD: number;
  liquidityUSD: number;
  transactionCount: number;
}

export interface AggregatorArgv {
  providers: ShareProviders;
  initialDate: number;
  forceSync: boolean;
}

export interface IDexProvider extends Provider {
  getDailyData: () => Promise<any>;
  getDateData: (date: number) => Promise<any>;
  runTest: () => Promise<any>;
  runAggregator: (argv: AggregatorArgv) => Promise<any>;
}
