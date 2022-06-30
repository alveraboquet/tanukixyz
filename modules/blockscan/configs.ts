import { getChainConfig } from '../../configs/chains';
import BitcoreBlockscanProvider from './providers/bitcore';
import BlockscanProvider from './providers/blockscan';
import EvmBlockscanProvider from './providers/evm';
import NearBlockscanProvider from './providers/near';
import TronBlockscanProvider from './providers/tron';

export const BlockscanProviderConfigs: { [key: string]: BlockscanProvider } = {
  ethereum: new EvmBlockscanProvider(getChainConfig('ethereum')),
  bitcoin: new BitcoreBlockscanProvider(getChainConfig('bitcoin')),
  avalanche: new EvmBlockscanProvider(getChainConfig('avalanche')),
  binance: new EvmBlockscanProvider(getChainConfig('binance')),
  polygon: new EvmBlockscanProvider(getChainConfig('polygon')),
  fantom: new EvmBlockscanProvider(getChainConfig('fantom')),
  near: new NearBlockscanProvider(getChainConfig('near')),
  tron: new TronBlockscanProvider(getChainConfig('tron')),
};
