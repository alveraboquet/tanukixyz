import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const UniswapV2Configs: UniswapProtocolConfig = {
  name: 'uniswap',
  subgraphs: ['https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'],
  tokenomics: DefaultTokenList.UNI,
};

export const UniswapV1Configs: UniswapProtocolConfig = {
  name: 'uniswap',
  subgraphs: ['https://api.thegraph.com/subgraphs/name/ianlapham/uniswap'],
};

export const UniswapV3Configs: UniswapProtocolConfig = {
  name: 'uniswap',
  subgraphs: [
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  ],
};
