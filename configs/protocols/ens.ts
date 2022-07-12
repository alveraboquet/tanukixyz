import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { ChainConfig, TokenConfig } from '../types';

export interface EnsProtocolConfig {
  name: string;
  chain: ChainConfig;
  tokenomics?: TokenConfig;
  subgraph: string;
}

export const EnsConfigs: EnsProtocolConfig = {
  name: 'ens',
  chain: getChainConfig('ethereum'),
  tokenomics: DefaultTokenList.ENS,
  subgraph: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
};
