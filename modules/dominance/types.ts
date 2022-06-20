import { Provider } from '../../core/namespaces';

export enum CoinType {
  STOCK,
  CRYPTO,
}

export interface CoinConfig {
  id: string;
  ticker: string;
  type: CoinType;
}

export interface CoinDateData {
  date: number;
  ticker: string;
  volumeUSD: number;
  priceUSD: number;
  marketCapUSD: number;
}

export interface RunAggregatorProps {
  initialDate: number;
  forceSync: boolean;
}

export interface IDominanceProvider extends Provider {
  getDataInRange: (fromTimestamp: number, toTimestamp: number) => Promise<any>;
  runAggregator: (props: RunAggregatorProps) => Promise<any>;
}
