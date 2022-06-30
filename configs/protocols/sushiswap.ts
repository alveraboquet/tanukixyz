import { UniswapProtocolConfig } from '../types';

export const SushiswapConfigs: UniswapProtocolConfig = {
  name: 'sushiswap',
  subgraphs: [
    'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
    'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
    'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
    'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange',
  ],
};
