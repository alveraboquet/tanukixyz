import { getChainConfig } from '../chains';
import { UniswapProtocolConfig } from '../types';

export const QuickswapConfigs: UniswapProtocolConfig = {
  name: 'quickswap',
  tokenomics: {
    symbol: 'QUICK',
    coingeckoId: 'quick',
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
      exchange: 'https://polygon.furadao.org/subgraphs/name/quickswap',
    },
  ],
};
