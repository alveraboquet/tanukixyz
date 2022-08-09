import { TokenConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import { ProtocolTokenData } from '../../types';
import { ReserveMap } from './reserves';

export function getReserveConfig(reserveAddress: string): TokenConfig | undefined {
  for (const [address, token] of Object.entries(ReserveMap)) {
    if (normalizeAddress(address) === normalizeAddress(reserveAddress)) {
      return token;
    }
  }
  return undefined;
}

export function findTokenData(tokenAddress: string, tokenList: Array<ProtocolTokenData>): number {
  for (let i = 0; i < tokenList.length; i++) {
    if (normalizeAddress(tokenList[i].address) === normalizeAddress(tokenAddress)) {
      return 1;
    }
  }

  return -1;
}
