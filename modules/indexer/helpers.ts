import LendEther from '../../core/abi/compound/LendEther.json';
import LendToken from '../../core/abi/compound/LendToken.json';
import { getChainConfig } from '../../core/constants/chains';
import { IndexConfig } from './types';

export function getCompoundPoolTokenIndexConfig(chain: string, address: string, genesisBlock: number): IndexConfig {
  return {
    chainConfig: getChainConfig(chain),
    contractAbi: LendToken,
    contractAddress: address, // AAVE
    contractBirthday: genesisBlock,
    events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
  };
}
export function getCompoundPoolEtherIndexConfig(chain: string, address: string, genesisBlock: number): IndexConfig {
  return {
    chainConfig: getChainConfig(chain),
    contractAbi: LendEther,
    contractAddress: address, // AAVE
    contractBirthday: genesisBlock,
    events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
  };
}
