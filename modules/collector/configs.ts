import { AurigamiConfigs } from '../../configs/protocols/aurigami';
import { BabyswapConfigs } from '../../configs/protocols/babyswap';
import { BalancerConfigs } from '../../configs/protocols/balancer';
import { BastionConfigs } from '../../configs/protocols/bastion';
import { BeetsConfigs } from '../../configs/protocols/beets';
import { BenqiConfigs } from '../../configs/protocols/benqi';
import { BiswapConfigs } from '../../configs/protocols/biswap';
import { CompoundConfigs } from '../../configs/protocols/compound';
import { CreamConfigs } from '../../configs/protocols/cream';
import { EulerConfigs } from '../../configs/protocols/euler';
import { IronBankConfigs } from '../../configs/protocols/ironbank';
import { LiquityConfigs } from '../../configs/protocols/liquity';
import { MmfinanceConfigs } from '../../configs/protocols/mmfinance';
import { PancakeswapConfigs } from '../../configs/protocols/pancakeswap';
import { QuickswapConfigs } from '../../configs/protocols/quickswap';
import { RefFinanceConfigs } from '../../configs/protocols/reffinance';
import { SpookyswapConfigs } from '../../configs/protocols/spookyswap';
import { SushiswapConfigs } from '../../configs/protocols/sushiswap';
import { TraderJoeExchangeConfigs, TraderJoeLendingConfigs } from '../../configs/protocols/traderjoe';
import { UniswapConfigs } from '../../configs/protocols/uniswap';
import { VenusConfigs } from '../../configs/protocols/venus';
import { VvsfinanceConfigs } from '../../configs/protocols/vvsfinance';
import { BalancerProvider } from './providers/balancer/balancer';
import CollectorProvider from './providers/collector';
import CompoundProvider from './providers/compound/compound';
import EulerProvider from './providers/euler/euler';
import LiquityProvider from './providers/liquity/liquity';
import { PancakeswapProvider } from './providers/pancakeswap/pancakeswap';
import { PancakeswapStreamFastProvider } from './providers/pancakeswap/pancakeswapStreamfast';
import { RefFinanceProvider } from './providers/reffinance/reffinance';
import { SushiswapProvider } from './providers/sushiswap/sushiswap';
import TraderjoeProvider from './providers/traderjoe/traderjoe';
import { UniswapProvider } from './providers/uniswap/uniswap';
import { VvsfinanceProvider } from './providers/vvsfinance/vvsfinance';

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
  uniswap: new UniswapProvider(UniswapConfigs),
  sushiswap: new SushiswapProvider(SushiswapConfigs),
  spookyswap: new UniswapProvider(SpookyswapConfigs),
  pancakeswap: new PancakeswapStreamFastProvider(PancakeswapConfigs),
  balancer: new BalancerProvider(BalancerConfigs),
  beets: new BalancerProvider(BeetsConfigs),
  biswap: new PancakeswapProvider(BiswapConfigs),
  babyswap: new PancakeswapProvider(BabyswapConfigs),
  mmfinance: new PancakeswapProvider(MmfinanceConfigs),
  reffinance: new RefFinanceProvider(RefFinanceConfigs),
  quickswap: new UniswapProvider(QuickswapConfigs),
  vvsfinance: new VvsfinanceProvider(VvsfinanceConfigs),
};
