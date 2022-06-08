import { Provider } from '../core/namespaces';
import { ShareProviders } from '../core/types';

// all module services should extend StateService
export class BaseService implements Provider {
  public readonly name: string = 'module.base';

  readonly _providers: ShareProviders;

  constructor(providers: ShareProviders) {
    this._providers = providers;
  }
}

export default BaseService;
