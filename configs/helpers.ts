import { normalizeAddress } from '../lib/helper';
import CauldronV3 from './abi/abracadabra/CauldronV3.json';
import ibTokenAbi from './abi/alpaca/ibToken.json';
import cTokenAbi from './abi/compound/cToken.json';
import { getChainConfig } from './chains';
import { DefaultTokenLists } from './constants/tokenLists';
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

export function getDefaultTokenAddresses(chain: string): Array<string> {
  const tokenLists: Array<string> = [];

  if (DefaultTokenLists[chain]) {
    for (let list of DefaultTokenLists[chain].lists) {
      for (let token of list) {
        if (Number(token.chainId) === DefaultTokenLists[chain].chainId) {
          tokenLists.push(normalizeAddress(token.address));
        }
      }
    }
  }

  return tokenLists;
}

export function getDefaultTokenLogoURI(chain: string, address: string): string | null {
  if (DefaultTokenLists[chain]) {
    for (let list of DefaultTokenLists[chain].lists) {
      for (let token of list) {
        if (normalizeAddress(address) === normalizeAddress(token.address)) {
          return token.logoURI;
        }
      }
    }
  }

  return null;
}
