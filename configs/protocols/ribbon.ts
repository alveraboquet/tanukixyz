import { ProtocolConfig } from '../types';

export interface RibbonProtocolConfig extends ProtocolConfig {
  subgraphs: Array<{
    version: 1 | 2;
    endpoint: string;
  }>;
}

export const RibbonConfigs: RibbonProtocolConfig = {
  name: 'ribbon',
  tokenomics: {
    symbol: 'RBN',
    coingeckoId: 'ribbon-finance',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  subgraphs: [
    {
      version: 1,
      endpoint: 'https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance',
    },
    {
      version: 2,
      endpoint: 'https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2',
    },
  ],
};
