import { DefaultTokenList } from '../constants/defaultTokenList';
import { TokenConfig } from '../types';

export interface RefFinanceConfig {
  name: string;
  tokenomics?: TokenConfig;
  apiEndpoints: {
    topPools: string;
    lastTvl: string;
  };
  subgraph: string;
}

export const RefFinanceConfigs: RefFinanceConfig = {
  name: 'reffinance',
  tokenomics: DefaultTokenList.REF,
  apiEndpoints: {
    topPools: 'https://api.stats.ref.finance/api/top-pools',
    lastTvl: 'https://api.stats.ref.finance/api/last-tvl',
  },
  subgraph: 'https://api.thegraph.com/subgraphs/name/aluhning/ref-finance',
};
