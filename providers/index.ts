import { DefaultTokenList } from '../configs/constants/defaultTokenList';
import { AaveConfigs } from '../configs/protocols/aave';
import { AbracadabraConfigs } from '../configs/protocols/abracadabra';
import { AlpacaConfigs } from '../configs/protocols/alpaca';
import { AurigamiConfigs } from '../configs/protocols/aurigami';
import { BabyswapConfigs } from '../configs/protocols/babyswap';
import { BalancerConfigs } from '../configs/protocols/balancer';
import { BastionConfigs } from '../configs/protocols/bastion';
import { BeetsConfigs } from '../configs/protocols/beets';
import { BenqiConfigs } from '../configs/protocols/benqi';
import { BiswapConfigs } from '../configs/protocols/biswap';
import { CompoundConfigs } from '../configs/protocols/compound';
import { ConvexConfigs } from '../configs/protocols/convex';
import { CreamConfigs } from '../configs/protocols/cream';
import { CurveConfigs } from '../configs/protocols/curve';
import { DodoexConfigs } from '../configs/protocols/dodoex';
import { EulerConfigs } from '../configs/protocols/euler';
import { IronBankConfigs } from '../configs/protocols/ironbank';
import { LiquityConfigs } from '../configs/protocols/liquity';
import { MmfinanceConfigs } from '../configs/protocols/mmfinance';
import { PancakeswapConfigs } from '../configs/protocols/pancakeswap';
import { QuickswapConfigs } from '../configs/protocols/quickswap';
import { RefFinanceConfigs } from '../configs/protocols/reffinance';
import { RibbonConfigs } from '../configs/protocols/ribbon';
import { RoninKatanaConfigs } from '../configs/protocols/ronin';
import { SpookyswapConfigs } from '../configs/protocols/spookyswap';
import { SushiswapConfigs } from '../configs/protocols/sushiswap';
import { TraderJoeExchangeConfigs, TraderJoeLendingConfigs } from '../configs/protocols/traderjoe';
import { UniswapConfigs } from '../configs/protocols/uniswap';
import { VenusConfigs } from '../configs/protocols/venus';
import { VvsfinanceConfigs } from '../configs/protocols/vvsfinance';
import { ShareProviders } from '../lib/types';
import { RoninKatanaProvider } from '../modules/collector/providers/katana/katana';
import { PancakeswapProvider } from '../modules/collector/providers/pancakeswap/pancakeswap';
import { SushiswapProvider } from '../modules/collector/providers/sushiswap/sushiswap';
import { UniswapProvider } from '../modules/collector/providers/uniswap/uniswap';
import { VvsfinanceProvider } from '../modules/collector/providers/vvsfinance/vvsfinance';
import { DefiAdapter } from './adapter';
import { AaveAdapter } from './adapters/aave';
import { AbracadabraAdapter } from './adapters/abracadabra';
import { AlpacaAdapter } from './adapters/alpaca';
import { BalancerAdapter } from './adapters/balancer';
import { CompoundAdapter } from './adapters/compound';
import { ConvexAdapter } from './adapters/convex';
import { CurveAdapter } from './adapters/curve';
import { DodoexAdapter } from './adapters/dodoex';
import { EulerAdapter } from './adapters/euler';
import { LiquityAdapter } from './adapters/liquity';
import { RefFinanceAdapter } from './adapters/reffinance';
import { RibbonAdapter } from './adapters/ribbon';
import { TraderJoeAdapter } from './adapters/traderjoe';
import { UniswapAdapter } from './adapters/uniswap';

export function getAdapter(protocol: string, providers: ShareProviders): DefiAdapter | null {
  switch (protocol) {
    // uniswap and forks
    case 'uniswap':
      return new UniswapAdapter(UniswapConfigs, providers, new UniswapProvider(UniswapConfigs));
    case 'sushiswap':
      return new UniswapAdapter(SushiswapConfigs, providers, new SushiswapProvider(SushiswapConfigs));
    case 'spookyswap':
      return new UniswapAdapter(SpookyswapConfigs, providers, new UniswapProvider(SpookyswapConfigs));
    case 'pancakeswap':
      return new UniswapAdapter(PancakeswapConfigs, providers, new PancakeswapProvider(PancakeswapConfigs));
    case 'biswap':
      return new UniswapAdapter(BiswapConfigs, providers, new PancakeswapProvider(BiswapConfigs));
    case 'babyswap':
      return new UniswapAdapter(BabyswapConfigs, providers, new PancakeswapProvider(BabyswapConfigs));
    case 'quickswap':
      return new UniswapAdapter(QuickswapConfigs, providers, new UniswapProvider(QuickswapConfigs));
    case 'vvsfinance':
      return new UniswapAdapter(VvsfinanceConfigs, providers, new VvsfinanceProvider(VvsfinanceConfigs));
    case 'mmfinance':
      return new UniswapAdapter(MmfinanceConfigs, providers, new PancakeswapProvider(MmfinanceConfigs));
    case 'katana':
      return new UniswapAdapter(RoninKatanaConfigs, providers, new RoninKatanaProvider(RoninKatanaConfigs));
    case 'traderjoe':
      return new TraderJoeAdapter(
        {
          name: 'traderjoe',
          exchange: TraderJoeExchangeConfigs,
          lending: TraderJoeLendingConfigs,
          tokenomics: DefaultTokenList.JOE,
        },
        providers
      );

    // compound and forks
    case 'compound':
      return new CompoundAdapter(CompoundConfigs, providers);
    case 'ironbank':
      return new CompoundAdapter(IronBankConfigs, providers);
    case 'cream':
      return new CompoundAdapter(CreamConfigs, providers);
    case 'benqi':
      return new CompoundAdapter(BenqiConfigs, providers);
    case 'venus':
      return new CompoundAdapter(VenusConfigs, providers);
    case 'bastion':
      return new CompoundAdapter(BastionConfigs, providers);
    case 'aurigami':
      return new CompoundAdapter(AurigamiConfigs, providers);

    // aave and forks
    case 'aave':
      return new AaveAdapter(AaveConfigs, providers);

    // balancer and forks
    case 'balancer':
      return new BalancerAdapter(BalancerConfigs, providers);
    case 'beets':
      return new BalancerAdapter(BeetsConfigs, providers);

    // others
    case 'abracadabra':
      return new AbracadabraAdapter(AbracadabraConfigs, providers);
    case 'convex':
      return new ConvexAdapter(ConvexConfigs, providers);
    case 'ribbon':
      return new RibbonAdapter(RibbonConfigs, providers);
    case 'liquity':
      return new LiquityAdapter(LiquityConfigs, providers);
    case 'euler':
      return new EulerAdapter(EulerConfigs, providers);
    case 'alpaca':
      return new AlpacaAdapter(AlpacaConfigs, providers);

    // use API
    case 'curve':
      return new CurveAdapter(CurveConfigs, providers);
    case 'dodoex':
      return new DodoexAdapter(DodoexConfigs, providers);
    case 'reffinance':
      return new RefFinanceAdapter(RefFinanceConfigs, providers);
    default:
      return null;
  }
}
