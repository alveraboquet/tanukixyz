import { getChainConfig } from '../chains';
import { ChainConfig, TokenConfig } from '../types';

export interface WombatProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraphs: Array<{
    chainConfig: ChainConfig;
    exchange: string;
  }>;
}

export const WombatConfigs: WombatProtocolConfig = {
  name: 'wombat',
  tokenomics: {
    symbol: 'WOM',
    coingeckoId: 'wombat-exchange',
    chains: {},
  },
  subgraphs: [
    {
      chainConfig: getChainConfig('binance'),
      exchange: 'https://api.thegraph.com/subgraphs/name/wombat-exchange/wombat-exchange',
    },
  ],
};
