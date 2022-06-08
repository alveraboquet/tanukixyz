import { getChainConfig } from '../../../../core/constants/chains';
import { DexSubgraphConfig } from '../../types';

export const UNISWAP_SUBGRAPH_V2: Array<DexSubgraphConfig> = [
  {
    blocks: getChainConfig('ethereum').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  },
];
export const UNISWAP_SUBGRAPH_V3: Array<DexSubgraphConfig> = [
  {
    blocks: getChainConfig('ethereum').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  {
    blocks: getChainConfig('polygon').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  },
];

// uniswap birthday is Thu Nov 01 2018 00:00:00 GMT+0000
// we start to sync data from Mon May 04 2020 00:00:00 GMT+0000 (uniswap v2 deployed)
export const UNISWAP_BIRTHDAY = 1588550400;
