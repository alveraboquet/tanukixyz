import { CompoundConfigs } from '../../configs/protocols/compound';
import { UniswapConfigs } from '../../configs/protocols/uniswap';
import { CompoundRegistryProvider } from './providers/compound/compound';
import RegistryProvider from './providers/registry';
import { UniswapRegistryProvider } from './providers/uniswap/uniswap';

export const Registries: { [key: string]: RegistryProvider } = {
  uniswap: new UniswapRegistryProvider(UniswapConfigs),
  compound: new CompoundRegistryProvider(CompoundConfigs),
};
