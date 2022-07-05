import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { UniswapProtocolConfig } from '../types';

export const MmfinanceConfigs: UniswapProtocolConfig = {
  name: 'mmfinance',
  tokenomics: DefaultTokenList.BABY,
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('cronos'),
      exchange: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/exchange',
    },
  ],
};
