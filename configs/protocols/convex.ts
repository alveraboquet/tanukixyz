import { DefaultTokenList } from '../constants/defaultTokenList';
import { TokenConfig } from '../types';

export interface ConvexProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraph: {
    curvePool: string;
    staking: string;
    locker: string;
  };
}

export const ConvexConfigs: ConvexProtocolConfig = {
  name: 'convex',
  tokenomics: DefaultTokenList.CVX,
  subgraph: {
    curvePool: 'https://api.thegraph.com/subgraphs/name/convex-community/curve-pools',
    staking: 'https://api.thegraph.com/subgraphs/name/convex-community/convex-staking',
    locker: 'https://api.thegraph.com/subgraphs/name/convex-community/locker',
  },
};
