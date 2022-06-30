import LidoAbi from '../abi/lido/LidoEthStaking.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { EventIndexConfig, TokenConfig } from '../types';

export interface LidoProtocolConfig {
  name: string;
  stakingToken: TokenConfig;
  stakingContract: Array<EventIndexConfig>;
}

export const LidoConfigs: LidoProtocolConfig = {
  name: 'lido',
  stakingToken: DefaultTokenList.ETH,
  stakingContract: [
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: LidoAbi,
      contractAddress: '0x47ebab13b806773ec2a2d16873e2df770d130b50',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Submitted'],
    },
  ],
};
