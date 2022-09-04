import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const UniswapConfigs: UniswapProtocolConfig = {
  name: 'uniswap',
  tokenomics: DefaultTokenList.UNI,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('ethereum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    },
    {
      version: 3,
      chainConfig: getChainConfig('ethereum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    },
    {
      version: 3,
      chainConfig: getChainConfig('polygon'),
      exchange: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    },
    {
      version: 3,
      chainConfig: getChainConfig('arbitrum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev',
    },
    {
      version: 3,
      chainConfig: getChainConfig('optimism'),
      exchange: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    },
    {
      version: 3,
      chainConfig: getChainConfig('celo'),
      exchange: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo',
    },
    {
      version: 3,
      chainConfig: getChainConfig('optimism'),
      exchange: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    },
  ],
};
