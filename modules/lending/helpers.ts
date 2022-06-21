import { LendingConfig } from './types';

export function getCoingeckoId(lendingConfig: LendingConfig, symbol: string): string {
  for (let configIdx = 0; configIdx < lendingConfig.configs.length; configIdx++) {
    for (let poolIdx = 0; poolIdx < lendingConfig.configs[configIdx].pools.length; poolIdx++) {
      if (symbol === lendingConfig.configs[configIdx].pools[poolIdx].underlyingSymbol) {
        return lendingConfig.configs[configIdx].pools[poolIdx].underlyingCoingeckoId;
      }
    }
  }

  return '';
}
