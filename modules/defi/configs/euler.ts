import { getChainConfig } from '../../../core/constants/chains';
import { ChainConfig } from '../../../core/types';

export interface EulerProviderConfig {
  name: string;
  chainConfig: ChainConfig;
  graphEndpoint: string;
}

export const EulerConfig: EulerProviderConfig = {
  name: 'euler',
  chainConfig: getChainConfig('ethereum'),
  graphEndpoint: 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet',
};
