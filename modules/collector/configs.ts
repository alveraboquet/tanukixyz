import { AurigamiConfigs } from '../../configs/protocols/aurigami';
import { BastionConfigs } from '../../configs/protocols/bastion';
import { BenqiConfigs } from '../../configs/protocols/benqi';
import { CompoundConfigs } from '../../configs/protocols/compound';
import { CreamConfigs } from '../../configs/protocols/cream';
import { EulerConfigs } from '../../configs/protocols/euler';
import { IronBankConfigs } from '../../configs/protocols/ironbank';
import { LiquityConfigs } from '../../configs/protocols/liquity';
import { PancakeswapConfigs } from '../../configs/protocols/pancakeswap';
import { SpookyswapConfigs } from '../../configs/protocols/spookyswap';
import { SushiswapConfigs } from '../../configs/protocols/sushiswap';
import { TraderJoeExchangeConfigs, TraderJoeLendingConfigs } from '../../configs/protocols/traderjoe';
import { UniswapV2Configs } from '../../configs/protocols/uniswap';
import { VenusConfigs } from '../../configs/protocols/venus';
import CollectorProvider from './providers/collector';
import CompoundProvider from './providers/compound/compound';
import EulerProvider from './providers/euler/euler';
import LiquityProvider from './providers/liquity/liquity';
import { PancakeswapProvider } from './providers/pancakeswap/pancakeswap';
import { SushiswapProvider } from './providers/sushiswap/sushiswap';
import TraderjoeProvider from './providers/traderjoe/traderjoe';
import { UniswapProvider } from './providers/uniswap/uniswap';
import { UniswapV2Provider } from './providers/uniswap/uniswapv2';

export const Providers: { [key: string]: CollectorProvider } = {
  compound: new CompoundProvider(CompoundConfigs),
  liquity: new LiquityProvider(LiquityConfigs),
  euler: new EulerProvider(EulerConfigs),
  ironbank: new CompoundProvider(IronBankConfigs),
  cream: new CompoundProvider(CreamConfigs),
  benqi: new CompoundProvider(BenqiConfigs),
  venus: new CompoundProvider(VenusConfigs),
  traderjoe: new TraderjoeProvider({
    name: 'traderjoe',
    exchange: TraderJoeExchangeConfigs,
    lending: TraderJoeLendingConfigs,
  }),
  bastion: new CompoundProvider(BastionConfigs),
  aurigami: new CompoundProvider(AurigamiConfigs),
  uniswap: new UniswapProvider(UniswapV2Configs),
  sushiswap: new SushiswapProvider(SushiswapConfigs),
  spookyswap: new UniswapV2Provider(SpookyswapConfigs),
  pancakeswap: new PancakeswapProvider(PancakeswapConfigs),
};
