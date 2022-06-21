import { LendingConfigs } from './constants';
import AaveProvider from './projects/aave';
import CompoundProvider from './projects/compound';
import LiquityProvider from './projects/liquity';
import { ILendingProvider } from './types';

export const LendingProviders: { [key: string]: ILendingProvider | null } = {
  compound: new CompoundProvider(LendingConfigs.compound),
  // aave: new AaveProvider(LendingConfigs.aave),
  liquity: new LiquityProvider(LendingConfigs.liquity),
  ironbank: new CompoundProvider(LendingConfigs.ironbank),
  venus: new CompoundProvider(LendingConfigs.venus),
  benqi: new CompoundProvider(LendingConfigs.benqi),
  traderjoe: new CompoundProvider(LendingConfigs.traderjoe),
  scream: new CompoundProvider(LendingConfigs.scream),
  aurigami: new CompoundProvider(LendingConfigs.aurigami),
  bastion: new CompoundProvider(LendingConfigs.bastion),
};

export function getLendingProviderList() {
  const LendingList: Array<string> = [];
  for (const [key] of Object.entries(LendingProviders)) {
    LendingList.push(key);
  }
  return LendingList;
}
