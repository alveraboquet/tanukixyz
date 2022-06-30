import cTokenAbi from './abi/compound/cToken.json';
import { getChainConfig } from './chains';
import { CompoundLendingPoolConfig, TokenConfig } from './types';

export function getCompoundPoolConfig(
  chain: string,
  address: string,
  genesisBlock: number,
  token: TokenConfig
): CompoundLendingPoolConfig {
  return {
    chainConfig: getChainConfig(chain),
    contractAbi: cTokenAbi,
    contractAddress: address,
    contractBirthday: genesisBlock,
    events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
    underlying: token,
  };
}
