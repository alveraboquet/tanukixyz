import { AurigamiConfig } from './configs/aurigami';
import { BastionConfig } from './configs/bastion';
import { BenqiConfig } from './configs/benqi';
import { CompoundConfig } from './configs/compound';
import { CreamConfig } from './configs/cream';
import { EulerConfig } from './configs/euler';
import { IronBankConfig } from './configs/ironbank';
import { LiquityConfig } from './configs/liquity';
import { TraderJoeLendingConfig } from './configs/traderjoe';
import { VenusConfig } from './configs/venus';
import CompoundProvider from './providers/compound/compound';
import EulerProvider from './providers/euler/euler';
import LiquityProvider from './providers/liquity/liquity';
import { IDefiProvider } from './types';

export const Providers: { [key: string]: IDefiProvider } = {
  compound: new CompoundProvider(CompoundConfig),
  ironbank: new CompoundProvider(IronBankConfig),
  liquity: new LiquityProvider(LiquityConfig),
  cream: new CompoundProvider(CreamConfig),
  benqi: new CompoundProvider(BenqiConfig),
  venus: new CompoundProvider(VenusConfig),
  traderjoe: new CompoundProvider(TraderJoeLendingConfig),
  bastion: new CompoundProvider(BastionConfig),
  aurigami: new CompoundProvider(AurigamiConfig),
  euler: new EulerProvider(EulerConfig),
};
