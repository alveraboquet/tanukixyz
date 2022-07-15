import { PancakeswapConfigs } from '../../configs/protocols/pancakeswap';
import { SushiswapConfigs } from '../../configs/protocols/sushiswap';
import { UniswapConfigs } from '../../configs/protocols/uniswap';
import { PancakeswapRegistryProvider } from './providers/pancakeswap/pancakeswap';
import { UniswapRegistryProvider } from './providers/uniswap/uniswap';
import { IRegistryProvider } from './types';

export const Registries: { [key: string]: IRegistryProvider } = {
  uniswap: new UniswapRegistryProvider(UniswapConfigs),
  sushiswap: new UniswapRegistryProvider(SushiswapConfigs),
  pancakeswap: new PancakeswapRegistryProvider(PancakeswapConfigs),
};
