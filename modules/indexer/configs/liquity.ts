import LiquityBorrowOperationAbi from '../../../core/abi/liquity/BorrowOperation.json';
import LiquityTroveManagerAbi from '../../../core/abi/liquity/TroveManager.json';
import { getChainConfig } from '../../../core/constants/chains';
import { IndexConfig } from '../types';

const SyncFromBlock = 13910000; // Dec-31-2021 12:53:50 AM +UTC

const LiquityConfigs: Array<IndexConfig> = [
  {
    chainConfig: getChainConfig('ethereum'),
    contractAbi: LiquityBorrowOperationAbi,
    contractAddress: '0x24179CD81c9e782A4096035f7eC97fB8B783e007', // Borrow Operations
    contractBirthday: SyncFromBlock,
    events: ['TroveCreated', 'TroveUpdated', 'LUSDBorrowingFeePaid'],
  },
  {
    chainConfig: getChainConfig('ethereum'),
    contractAbi: LiquityTroveManagerAbi,
    contractAddress: '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2', // Trove Manager
    contractBirthday: SyncFromBlock,
    events: ['TroveLiquidated', 'Liquidation'],
  },
];

export default LiquityConfigs;
