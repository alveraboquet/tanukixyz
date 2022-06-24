import LiquityBorrowOperationAbi from '../../../core/abi/liquity/BorrowOperation.json';
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
];

export default LiquityConfigs;
