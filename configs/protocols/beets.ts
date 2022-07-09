import { getChainConfig } from '../chains';
import { BalancerProtocolConfig } from '../types';

export const BeetsConfigs: BalancerProtocolConfig = {
  name: 'beets',
  tokenomics: {
    symbol: 'BEETS',
    coingeckoId: 'beethoven-x',
    chains: {
      fantom: {
        decimals: 18,
        address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
      },
    },
  },
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('fantom'),
      exchange: 'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx',
    },
  ],
};
