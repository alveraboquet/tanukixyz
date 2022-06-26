import { CompoundConfig } from './configs/compound';
import { IronBankConfig } from './configs/ironbank';
import { LiquityConfig } from './configs/liquity';
import CompoundProvider from './providers/compound/compound';
import LiquityProvider from './providers/liquity/liquity';
import { IDefiProvider } from './types';
import {CreamConfig} from "./configs/cream";
import {BenqiConfig} from "./configs/benqi";
import {VenusConfig} from "./configs/venus";
import {TraderJoeLendingConfig} from "./configs/traderjoe";
import {BastionConfig} from "./configs/bastion";

export const Providers: { [key: string]: IDefiProvider } = {
  compound: new CompoundProvider(CompoundConfig),
  ironbank: new CompoundProvider(IronBankConfig),
  liquity: new LiquityProvider(LiquityConfig),
  cream: new CompoundProvider(CreamConfig),
  benqi: new CompoundProvider(BenqiConfig),
  venus: new CompoundProvider(VenusConfig),
  traderjoe: new CompoundProvider(TraderJoeLendingConfig),
  bastion: new CompoundProvider(BastionConfig),
};
