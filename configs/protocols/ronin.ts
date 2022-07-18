import { getChainConfig } from '../chains';
import { UniswapProtocolConfig } from '../types';

export const RoninKatanaConfigs: UniswapProtocolConfig = {
  name: 'katana',
  subgraphs: [
    {
      version: 2,
      chainConfig: getChainConfig('ronin'),
      exchange: 'https://thegraph.roninchain.com/subgraphs/name/axieinfinity/katana-subgraph-blue',
    },
  ],
};
