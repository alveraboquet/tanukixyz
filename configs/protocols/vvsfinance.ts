import { getChainConfig } from '../chains';
import { UniswapProtocolConfig } from '../types';

export const VvsfinanceConfigs: UniswapProtocolConfig = {
  name: 'vvsfinance',
  tokenomics: {
    symbol: 'VVS',
    coingeckoId: 'vvs-finance',
    chains: {
      cronos: {
        decimals: 18,
        address: '',
      },
    },
  },
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('cronos'),
      exchange: 'https://graph.vvs.finance/exchange',
    },
  ],
};
