import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const PancakeswapConfigs: UniswapProtocolConfig = {
  name: 'pancakeswap',
  tokenomics: DefaultTokenList.CAKE,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('binance'),
      exchange: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
    },
  ],
};
