import { CompoundLendingPoolConfig, TokenConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';

export function getPoolConfigByAddress(
  poolAddress: string,
  pools: Array<CompoundLendingPoolConfig>
): CompoundLendingPoolConfig | null {
  for (let i = 0; i < pools.length; i++) {
    if (normalizeAddress(pools[i].contractAddress) === normalizeAddress(poolAddress)) {
      return pools[i];
    }
  }

  return null;
}

export function getCompound3TokenConfig(
  address: string,
  chain: string,
  tokens: Array<TokenConfig>
): TokenConfig | null {
  for (const token of tokens) {
    const tokenAddress = token.chains[chain].address;
    if (normalizeAddress(address) === normalizeAddress(tokenAddress)) {
      return token;
    }
  }

  return null;
}
