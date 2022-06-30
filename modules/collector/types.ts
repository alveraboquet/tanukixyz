import { Provider } from '../../lib/types';

export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolDateData {
  module: string;
  date: number;
  name: string; // defi project name
  revenueUSD: number;
  totalValueLockedUSD: number;
  volumeInUseUSD: number;
  userCount: number;
  transactionCount: number;

  tokenomics?: ProtocolTokenomics;
}

export interface ICollectorProvider extends Provider {
  getDateData: (argv: any) => Promise<any>;
  startService: (argv: any) => Promise<any>;
}
