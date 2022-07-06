import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const SpookyswapConfigs: UniswapProtocolConfig = {
  name: 'spookyswap',
  tokenomics: DefaultTokenList.BOO,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('fantom'),
      exchange: 'https://api.fura.org/subgraphs/name/spookyswap',
    },
  ],
};
