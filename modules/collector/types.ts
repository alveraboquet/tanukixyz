import { Provider, ShareProviders } from '../../lib/types';

export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolDataChange {
  revenueChangePercentage: number;
  totalValueLockedChangePercentage: number;
  volumeInUseChangePercentage: number;
  userCountChangePercentage: number;
  transactionCountChangePercentage: number;
}

export interface ProtocolData {
  revenueUSD: number;
  totalValueLockedUSD: number;
  volumeInUseUSD: number;
  userCount: number;
  transactionCount: number;

  tokenomics?: ProtocolTokenomics;
  changes?: ProtocolDataChange;
}

export interface ICollectorProvider extends Provider {
  getDataInTimeFrame: (providers: ShareProviders, fromTime: number, toTime: number) => Promise<any>;

  // get latest 24 hours metrics
  getDailyData: (argv: any) => Promise<any>;

  // get metrics in a given date
  getDateData: (argv: any) => Promise<any>;

  // start collector service
  startService: (argv: any) => Promise<any>;
}
