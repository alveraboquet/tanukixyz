import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { EulerProtocolConfig } from '../types';

export const EulerConfigs: EulerProtocolConfig = {
  name: 'euler',
  tokenomics: DefaultTokenList.EUL,
  chainConfig: getChainConfig('ethereum'),
  graphEndpoint: 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet',
};
