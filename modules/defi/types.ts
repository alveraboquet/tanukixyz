import { Provider } from '../../core/namespaces';
import { CoreData } from '../../core/types';

export interface DefiDateData extends CoreData {
  date: number;
  name: string; // defi project name
  revenueUSD: number;
  totalValueLockedUSD: number;
  volumeInUseUSD: number;
  userCount: number;
  transactionCount: number;
}

export interface IDefiProvider extends Provider {
  getDateData: (argv: any) => Promise<any>;
  startService: (argv: any) => Promise<any>;
}
