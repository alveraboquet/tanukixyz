import { DefaultTokenList } from '../constants/defaultTokenList';
import { TokenConfig } from '../types';

export interface CurveProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraph: string;
}

export const CurveConfigs: CurveProtocolConfig = {
  name: 'curve',
  tokenomics: DefaultTokenList.CRV,
  subgraph: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
};
