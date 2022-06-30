import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const SpookyswapConfigs: UniswapProtocolConfig = {
  name: 'spookyswap',
  tokenomics: DefaultTokenList.BOO,
  subgraphs: ['https://api.thegraph.com/subgraphs/name/eerieeight/spookyswap'],
};
