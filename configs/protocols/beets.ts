import { getChainConfig } from '../chains';
import { BalancerProtocolConfig } from '../types';

export const BeetsConfigs: BalancerProtocolConfig = {
  name: 'beets',
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('fantom'),
      exchange: 'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx',
    },
  ],
};
