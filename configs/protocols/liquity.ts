import BorrowOperationAbi from '../abi/liquity/BorrowOperation.json';
import TroveManagerAbi from '../abi/liquity/TroveManager.json';
import { getChainConfig } from '../chains';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { LiquityProtocolConfig } from '../types';

export const LiquityConfigs: LiquityProtocolConfig = {
  name: 'liquity',
  chainConfig: getChainConfig('ethereum'),
  borrowOperation: {
    chainConfig: getChainConfig('ethereum'),
    contractAbi: BorrowOperationAbi,
    contractAddress: '0x24179CD81c9e782A4096035f7eC97fB8B783e007', // Borrow Operations
    contractBirthday: GenesisBlocks['ethereum'],
    events: ['TroveCreated', 'TroveUpdated', 'LUSDBorrowingFeePaid'],
  },
  troveManager: {
    chainConfig: getChainConfig('ethereum'),
    contractAbi: TroveManagerAbi,
    contractAddress: '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2', // Trove Manager
    contractBirthday: GenesisBlocks['ethereum'],
    events: ['TroveLiquidated', 'Liquidation'],
  },
};
