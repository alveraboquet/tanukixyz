import { getChainConfig } from '../../../core/constants/chains';
import { ChainConfig } from '../../../core/types';

export interface LiquityProviderConfig {
  name: string;
  chainConfig: ChainConfig;
  lendingContract: string;
}

export const LiquityConfig: LiquityProviderConfig = {
  name: 'liquity',
  chainConfig: getChainConfig('ethereum'),
  lendingContract: '0x24179CD81c9e782A4096035f7eC97fB8B783e007',
};
