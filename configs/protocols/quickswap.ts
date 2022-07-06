import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const QuickswapConfigs: UniswapProtocolConfig = {
  name: 'quickswap',
  tokenomics: {
    symbol: 'QUICK',
    coingeckoId: 'quickswap',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('polygon'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
    },
  ],
};
