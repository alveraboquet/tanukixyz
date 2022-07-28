import { CompoundConfigs } from '../configs/protocols/compound';
import { UniswapConfigs } from '../configs/protocols/uniswap';
import { ShareProviders } from '../lib/types';
import { DefiAdapter } from './adapter';
import { CompoundAdapter } from './adapters/compound';
import { UniswapAdapter } from './adapters/uniswap';

export function getAdapter(protocol: string, providers: ShareProviders): DefiAdapter | null {
  switch (protocol) {
    case 'uniswap': {
      return new UniswapAdapter(UniswapConfigs, providers);
    }
    case 'compound': {
      return new CompoundAdapter(CompoundConfigs, providers);
    }
    default:
      return null;
  }
}
