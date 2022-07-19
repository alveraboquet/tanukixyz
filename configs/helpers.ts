import CauldronV3 from './abi/abracadabra/CauldronV3.json';
import ibTokenAbi from './abi/alpaca/ibToken.json';
import cTokenAbi from './abi/compound/cToken.json';
import { getChainConfig } from './chains';
import { AbracadabraMarketConfig } from './protocols/abracadabra';
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
    events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow', 'LiquidateBorrow'],
    underlying: token,
  };
}

export function getAbracadabraMarketConfig(
  chain: string,
  address: string,
  genesisBlock: number
): AbracadabraMarketConfig {
  return {
    chainConfig: getChainConfig(chain),
    contractAbi: CauldronV3,
    contractAddress: address,
    contractBirthday: genesisBlock,
    events: ['LogAddCollateral', 'LogRemoveCollateral', 'LogBorrow', 'LogRepay', 'LogLiquidation'],
  };
}

export function getAlpacaPoolConfig(
  chain: string,
  address: string,
  genesisBlock: number,
  token: TokenConfig
): CompoundLendingPoolConfig {
  return {
    chainConfig: getChainConfig(chain),
    contractAbi: ibTokenAbi,
    contractAddress: address,
    contractBirthday: genesisBlock,
    events: ['Transfer', 'AddDebt', 'RemoveDebt', 'Work', 'Kill', 'AddCollateral'],
    underlying: token,
  };
}
