import { getChainConfig } from '../../../../core/constants/chains';
import { DexSubgraphConfig } from '../../types';

export const SUSHISWAP_SUBGRAPH: Array<DexSubgraphConfig> = [
  {
    blocks: getChainConfig('ethereum').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  },
  {
    blocks: getChainConfig('binance').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
  },
  {
    blocks: getChainConfig('polygon').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
  },
  {
    blocks: getChainConfig('fantom').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
  },
  {
    blocks: getChainConfig('avalanche').blockSubgraph as string,
    exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange',
  },
];

export const SUSHISWAP_BIRTHDAY = 1599609600;
