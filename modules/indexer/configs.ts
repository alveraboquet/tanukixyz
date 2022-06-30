import { AaveConfigs } from '../../configs/protocols/aave';
import { AurigamiConfigs } from '../../configs/protocols/aurigami';
import { BastionConfigs } from '../../configs/protocols/bastion';
import { BenqiConfigs } from '../../configs/protocols/benqi';
import { CompoundConfigs } from '../../configs/protocols/compound';
import { CreamConfigs } from '../../configs/protocols/cream';
import { IronBankConfigs } from '../../configs/protocols/ironbank';
import { LiquityConfigs } from '../../configs/protocols/liquity';
import { TraderJoeLendingConfigs } from '../../configs/protocols/traderjoe';
import { VenusConfigs } from '../../configs/protocols/venus';
import { EventIndexConfig } from '../../configs/types';

const IndexConfigs: { [key: string]: Array<EventIndexConfig> } = {
  compound: CompoundConfigs.pools,
  aave: AaveConfigs.pools,
  liquity: [LiquityConfigs.borrowOperation, LiquityConfigs.troveManager],
  ironbank: IronBankConfigs.pools,
  venus: VenusConfigs.pools,
  cream: CreamConfigs.pools,
  traderjoe: TraderJoeLendingConfigs.pools,
  benqi: BenqiConfigs.pools,
  bastion: BastionConfigs.pools,
  aurigami: AurigamiConfigs.pools,
};

export default IndexConfigs;
