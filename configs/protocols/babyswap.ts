import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const BabyswapConfigs: UniswapProtocolConfig = {
  name: 'babyswap',
  tokenomics: DefaultTokenList.BABY,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('binance'),
      exchange: 'https://api.thegraph.com/subgraphs/name/babyswapgraph/exchange2',
    },
  ],
};
