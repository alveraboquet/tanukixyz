import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const SushiswapConfigs: UniswapProtocolConfig = {
  name: 'sushiswap',
  tokenomics: DefaultTokenList.SUSHI,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('ethereum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    },
    {
      version: 2,
      chainConfig: getChainConfig('binance'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
    },
    {
      version: 2,
      chainConfig: getChainConfig('polygon'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
    },
    {
      version: 2,
      chainConfig: getChainConfig('fantom'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
    },
    {
      version: 2,
      chainConfig: getChainConfig('avalanche'),
      exchange: 'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange',
    },
  ],
};
