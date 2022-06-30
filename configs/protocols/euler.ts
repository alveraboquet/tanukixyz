import { getChainConfig } from '../chains';
import { EulerProtocolConfig } from '../types';

export const EulerConfigs: EulerProtocolConfig = {
  name: 'euler',
  chainConfig: getChainConfig('ethereum'),
  graphEndpoint: 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet',
};
