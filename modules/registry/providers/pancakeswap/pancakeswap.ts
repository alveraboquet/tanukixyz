import { UniswapProtocolConfig } from '../../../../configs/types';
import { UniswapRegistryProvider } from '../uniswap/uniswap';

export class PancakeswapRegistryProvider extends UniswapRegistryProvider {
  public readonly name: string = 'provider.pancakeswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  public getQueryConfigs(): any {
    return {
      queryRecordLimit: 20,
      filters: {
        transactionBlock: 'block',
      },
    };
  }
}
