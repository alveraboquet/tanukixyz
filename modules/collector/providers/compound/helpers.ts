import { CompoundLendingPoolConfig } from '../../../../configs/types';
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
