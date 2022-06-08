import { getChainConfig } from '../../core/constants/chains';
import BitcoreBlockSyncService from './sdk/bitcore';
import EvmBlockSyncService from './sdk/evm';
import NearBlockSyncService from './sdk/near';
import { IBlockSyncProvider } from './types';

export const BlockSyncProviders: { [key: string]: IBlockSyncProvider | null } = {
  // bitcore family
  bitcoin: new BitcoreBlockSyncService(getChainConfig('bitcoin')),

  // near family
  near: new NearBlockSyncService(getChainConfig('near')),

  // evm family
  ethereum: new EvmBlockSyncService(getChainConfig('ethereum')),
  binance: new EvmBlockSyncService(getChainConfig('binance')),
  polygon: new EvmBlockSyncService(getChainConfig('polygon')),
  fantom: new EvmBlockSyncService(getChainConfig('fantom')),
  avalanche: new EvmBlockSyncService(getChainConfig('avalanche')),
  cronos: new EvmBlockSyncService(getChainConfig('cronos')),
  metis: new EvmBlockSyncService(getChainConfig('metis')),
  harmony: new EvmBlockSyncService(getChainConfig('harmony')),
  aurora: new EvmBlockSyncService(getChainConfig('aurora')),
  celo: new EvmBlockSyncService(getChainConfig('celo')),
  arbitrum: new EvmBlockSyncService(getChainConfig('arbitrum')),
  moonbeam: new EvmBlockSyncService(getChainConfig('moonbeam')),
  moonriver: new EvmBlockSyncService(getChainConfig('moonriver')),
  gnosis: new EvmBlockSyncService(getChainConfig('gnosis')),
  fuse: new EvmBlockSyncService(getChainConfig('fuse')),
  evmos: new EvmBlockSyncService(getChainConfig('evmos')),
  iotex: new EvmBlockSyncService(getChainConfig('iotex')),
  heco: new EvmBlockSyncService(getChainConfig('heco')),
  okxchain: new EvmBlockSyncService(getChainConfig('okxchain')),
  kcc: new EvmBlockSyncService(getChainConfig('kcc')),
  milkomeda: new EvmBlockSyncService(getChainConfig('milkomeda')),
  astar: new EvmBlockSyncService(getChainConfig('astar')),
  conflux: new EvmBlockSyncService(getChainConfig('conflux')),
};

export function getChainProviderList() {
  const ChainList: Array<string> = [];
  for (const [key] of Object.entries(BlockSyncProviders)) {
    ChainList.push(key);
  }
  return ChainList;
}
