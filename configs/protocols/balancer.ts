import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { BalancerProtocolConfig } from '../types';

export const BalancerConfigs: BalancerProtocolConfig = {
  name: 'balancer',
  tokenomics: DefaultTokenList.BAL,
  subgraphs: [
    {
      version: 1,
      chainConfig: getChainConfig('ethereum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
    },
    {
      version: 2,
      chainConfig: getChainConfig('ethereum'),
      exchange: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    },
    {
      version: 2,
      chainConfig: getChainConfig('polygon'),
      exchange: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    },
  ],
};
