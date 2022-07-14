import { UniswapConfigs } from '../../configs/protocols/uniswap';
import { UniswapRegistryProvider } from './providers/uniswap/uniswap';
import { IRegistryProvider } from './types';

export const Registries: { [key: string]: IRegistryProvider } = {
  uniswap: new UniswapRegistryProvider(UniswapConfigs),
};
