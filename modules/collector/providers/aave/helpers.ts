import { TokenConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import { ReserveMap } from './reserves';

export function getReserveConfig(reserveAddress: string): TokenConfig | undefined {
  for (const [address, token] of Object.entries(ReserveMap)) {
    if (normalizeAddress(address) === normalizeAddress(reserveAddress)) {
      return token;
    }
  }
  return undefined;
}
