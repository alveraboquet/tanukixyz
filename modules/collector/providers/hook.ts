import { Provider, ShareProviders } from '../../../lib/types';

export interface GetHookDataProps {
  providers: ShareProviders;
  date: number;
}

export class CollectorHook implements Provider {
  public readonly name: string = 'hook.collector';

  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  getHookData(props: GetHookDataProps): Promise<any> {
    return Promise.resolve(undefined);
  }
}
