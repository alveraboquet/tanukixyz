import { normalizeAddress } from '../../../../core/helper';
import { CompoundLendingPoolConfig } from '../../configs/compound';

export function getPoolConfigByAddress(
  poolAddress: string,
  pools: Array<CompoundLendingPoolConfig>
): CompoundLendingPoolConfig | null {
  for (let i = 0; i < pools.length; i++) {
    if (normalizeAddress(pools[i].poolAddress) === normalizeAddress(poolAddress)) {
      return pools[i];
    }
  }

  return null;
}
