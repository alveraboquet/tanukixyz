import { normalizeAddress } from '../lib/helper';
import CauldronV3 from './abi/abracadabra/CauldronV3.json';
import ibTokenAbi from './abi/alpaca/ibToken.json';
import cTokenAbi from './abi/compound/cToken.json';
import curvePoolLendingAbi from './abi/curve/PoolSwapLending.json';
import curvePoolMetaAbi from './abi/curve/PoolSwapMeta.json';
import { getChainConfig } from './chains';
import { DefaultTokenLists } from './constants/tokenLists';
import { AbracadabraMarketConfig } from './protocols/abracadabra';
import { CompoundLendingPoolConfig, CurvePoolConfig, TokenConfig } from './types';

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

export function getCurvePoolConfig(
  chain: string,
  address: string,
  genesisBlock: number,
  type: 'meta' | 'lending',
  tokens: Array<TokenConfig>
): CurvePoolConfig {
  if (type === 'meta') {
    return {
      chainConfig: getChainConfig(chain),
      contractAbi: curvePoolMetaAbi,
      contractAddress: address,
      contractBirthday: genesisBlock,
      events: ['AddLiquidity', 'RemoveLiquidity', 'TokenExchange', 'RemoveLiquidityOne', 'RemoveLiquidityImbalance'],
      poolType: type,
      tokens: tokens,
    };
  } else {
    return {
      chainConfig: getChainConfig(chain),
      contractAbi: curvePoolLendingAbi,
      contractAddress: address,
      contractBirthday: genesisBlock,
      events: [
        'AddLiquidity',
        'RemoveLiquidity',
        'TokenExchange',
        'TokenExchangeUnderlying',
        'RemoveLiquidityOne',
        'RemoveLiquidityImbalance',
      ],
      poolType: type,
      tokens: tokens,
    };
  }
}

export function getDefaultTokenAddresses(chain: string): Array<string> {
  const tokenLists: Array<string> = [];

  function checkDupAddress(list: Array<string>, address: string): boolean {
    for (let item of list) {
      if (normalizeAddress(item) === normalizeAddress(address)) {
        return true;
      }
    }

    return false;
  }

  if (DefaultTokenLists[chain]) {
    for (let list of DefaultTokenLists[chain].lists) {
      for (let token of list) {
        if (Number(token.chainId) === DefaultTokenLists[chain].chainId) {
          // make sure no dup address
          if (!checkDupAddress(tokenLists, token.address)) {
            tokenLists.push(normalizeAddress(token.address));
          }
        }
      }
    }
  }

  return tokenLists;
}

export function getTokenByAddress(chain: string, address: string): any {
  if (DefaultTokenLists[chain]) {
    for (let list of DefaultTokenLists[chain].lists) {
      for (let token of list) {
        if (Number(token.chainId) === DefaultTokenLists[chain].chainId && normalizeAddress(address) === token.address) {
          return token;
        }
      }
    }
  }

  return null;
}
