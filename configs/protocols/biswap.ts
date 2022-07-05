import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const BiswapConfigs: UniswapProtocolConfig = {
  name: 'biswap',
  tokenomics: DefaultTokenList.BSW,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('binance'),
      exchange: 'https://api.thegraph.com/subgraphs/name/biswapcom/exchange5',
    },
  ],
};
