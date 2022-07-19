import { DefaultTokenList } from '../../configs/constants/defaultTokenList';
import { AaveConfigs } from '../../configs/protocols/aave';
import { AbracadabraConfigs } from '../../configs/protocols/abracadabra';
import { AurigamiConfigs } from '../../configs/protocols/aurigami';
import { BabyswapConfigs } from '../../configs/protocols/babyswap';
import { BalancerConfigs } from '../../configs/protocols/balancer';
import { BastionConfigs } from '../../configs/protocols/bastion';
import { BeetsConfigs } from '../../configs/protocols/beets';
import { BenqiConfigs } from '../../configs/protocols/benqi';
import { BiswapConfigs } from '../../configs/protocols/biswap';
import { CompoundConfigs } from '../../configs/protocols/compound';
import { ConvexConfigs } from '../../configs/protocols/convex';
import { CreamConfigs } from '../../configs/protocols/cream';
import { CurveConfigs } from '../../configs/protocols/curve';
import { DodoexConfigs } from '../../configs/protocols/dodoex';
import { EulerConfigs } from '../../configs/protocols/euler';
import { IronBankConfigs } from '../../configs/protocols/ironbank';
import { LiquityConfigs } from '../../configs/protocols/liquity';
import { MmfinanceConfigs } from '../../configs/protocols/mmfinance';
import { PancakeswapConfigs } from '../../configs/protocols/pancakeswap';
import { QuickswapConfigs } from '../../configs/protocols/quickswap';
import { RefFinanceConfigs } from '../../configs/protocols/reffinance';
import { RibbonConfigs } from '../../configs/protocols/ribbon';
import { RoninKatanaConfigs } from '../../configs/protocols/ronin';
import { SpookyswapConfigs } from '../../configs/protocols/spookyswap';
import { SushiswapConfigs } from '../../configs/protocols/sushiswap';
import { TraderJoeExchangeConfigs, TraderJoeLendingConfigs } from '../../configs/protocols/traderjoe';
import { UniswapConfigs } from '../../configs/protocols/uniswap';
import { VenusConfigs } from '../../configs/protocols/venus';
import { VvsfinanceConfigs } from '../../configs/protocols/vvsfinance';
import { CompoundCollectorHook } from './hooks/compound';
import { AaveProvider } from './providers/aave/aave';
import { AbracadabraProvider } from './providers/abracadabra/abracadabra';
import { BalancerProvider } from './providers/balancer/balancer';
import { CollectorProvider } from './providers/collector';
import { CompoundProvider } from './providers/compound/compound';
import { ConvexProvider } from './providers/convex/convex';
import { CurveProvider } from './providers/curve/curve';
import { DodoexProvider } from './providers/dodoex/dodoex';
import { EulerProvider } from './providers/euler/euler';
import { RoninKatanaProvider } from './providers/katana/katana';
import { LiquityProvider } from './providers/liquity/liquity';
import { PancakeswapProvider } from './providers/pancakeswap/pancakeswap';
import { RefFinanceProvider } from './providers/reffinance/reffinance';
import { RibbonProvider } from './providers/ribbon/ribbon';
import { SushiswapProvider } from './providers/sushiswap/sushiswap';
import { TraderjoeProvider } from './providers/traderjoe/traderjoe';
import { UniswapProvider } from './providers/uniswap/uniswap';
import { VvsfinanceProvider } from './providers/vvsfinance/vvsfinance';

export const Providers: { [key: string]: CollectorProvider } = {
  compound: new CompoundProvider(CompoundConfigs, new CompoundCollectorHook(CompoundConfigs)),
  aave: new AaveProvider(AaveConfigs, null),
  abracadabra: new AbracadabraProvider(AbracadabraConfigs, null),
  curve: new CurveProvider(CurveConfigs, null),
  liquity: new LiquityProvider(LiquityConfigs, null),
  euler: new EulerProvider(EulerConfigs, null),
  convex: new ConvexProvider(ConvexConfigs, null),
  ribbon: new RibbonProvider(RibbonConfigs, null),
  ironbank: new CompoundProvider(IronBankConfigs, null),
  cream: new CompoundProvider(CreamConfigs, null),
  benqi: new CompoundProvider(BenqiConfigs, null),
  dodoex: new DodoexProvider(DodoexConfigs, null),
  venus: new CompoundProvider(VenusConfigs, null),
  traderjoe: new TraderjoeProvider(
    {
      name: 'traderjoe',
      exchange: TraderJoeExchangeConfigs,
      lending: TraderJoeLendingConfigs,
      tokenomics: DefaultTokenList.JOE,
    },
    null
  ),
  bastion: new CompoundProvider(BastionConfigs, null),
  aurigami: new CompoundProvider(AurigamiConfigs, null),
  uniswap: new UniswapProvider(UniswapConfigs, null),
  sushiswap: new SushiswapProvider(SushiswapConfigs, null),
  spookyswap: new UniswapProvider(SpookyswapConfigs, null),
  pancakeswap: new PancakeswapProvider(PancakeswapConfigs, null),
  balancer: new BalancerProvider(BalancerConfigs, null),
  beets: new BalancerProvider(BeetsConfigs, null),
  biswap: new PancakeswapProvider(BiswapConfigs, null),
  babyswap: new PancakeswapProvider(BabyswapConfigs, null),
  mmfinance: new PancakeswapProvider(MmfinanceConfigs, null),
  reffinance: new RefFinanceProvider(RefFinanceConfigs, null),
  quickswap: new UniswapProvider(QuickswapConfigs, null),
  vvsfinance: new VvsfinanceProvider(VvsfinanceConfigs, null),
  katana: new RoninKatanaProvider(RoninKatanaConfigs, null),
};
