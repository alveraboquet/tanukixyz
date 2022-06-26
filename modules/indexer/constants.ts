import AurigamiConfigs from './configs/aurigami';
import BastionConfigs from './configs/bastion';
import BenqiConfigs from './configs/benqi';
import CompoundConfigs from './configs/compound';
import CreamConfigs from './configs/cream';
import IronBankConfigs from './configs/ironbank';
import LiquityConfigs from './configs/liquity';
import TraderJoeConfigs from './configs/traderjoe';
import VenusConfigs from './configs/venus';
import { IndexConfig } from './types';

const IndexConfigs: { [key: string]: Array<IndexConfig> } = {
  compound: CompoundConfigs,
  liquity: LiquityConfigs,
  ironbank: IronBankConfigs,
  cream: CreamConfigs,
  venus: VenusConfigs,
  traderjoe: TraderJoeConfigs,
  benqi: BenqiConfigs,
  bastion: BastionConfigs,
  aurigami: AurigamiConfigs,
};

export default IndexConfigs;
