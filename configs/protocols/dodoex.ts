import { TokenConfig } from '../types';

export interface DodoexProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraph: string;
}

export const DodoexConfigs: DodoexProtocolConfig = {
  name: 'dodoex',
  tokenomics: {
    symbol: 'DODO',
    coingeckoId: 'dodo',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
      },
    },
  },
  subgraph: 'https://gateway.dodoex.io/graphql?opname=FetchDashboardDailyData',
};
