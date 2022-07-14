import { Provider, RegistryTransactionData, ShareProviders } from '../../lib/types';

export interface IRegistryProvider extends Provider {
  getTransactionInTimeFrame: (
    providers: ShareProviders,
    fromTime: number,
    toTime: number
  ) => Promise<Array<RegistryTransactionData>>;

  // start registry service
  startService: (argv: any) => Promise<any>;
}
