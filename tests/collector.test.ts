import { describe } from 'mocha';

import { DefaultTokenList } from '../configs/constants/defaultTokenList';
import { BabyswapConfigs } from '../configs/protocols/babyswap';
import { BiswapConfigs } from '../configs/protocols/biswap';
import { MmfinanceConfigs } from '../configs/protocols/mmfinance';
import { PancakeswapConfigs } from '../configs/protocols/pancakeswap';
import { QuickswapConfigs } from '../configs/protocols/quickswap';
import { RoninKatanaConfigs } from '../configs/protocols/ronin';
import { SpookyswapConfigs } from '../configs/protocols/spookyswap';
import { SushiswapConfigs } from '../configs/protocols/sushiswap';
import { TraderJoeExchangeConfigs, TraderJoeLendingConfigs } from '../configs/protocols/traderjoe';
import { UniswapConfigs } from '../configs/protocols/uniswap';
import { VvsfinanceConfigs } from '../configs/protocols/vvsfinance';
import { getTimestamp, getTodayUTCTimestamp } from '../lib/helper';
import { DatabaseProvider, GraphProvider } from '../lib/providers';
import { ShareProviders } from '../lib/types';
import { RoninKatanaProvider } from '../modules/collector/providers/katana/katana';
import { PancakeswapProvider } from '../modules/collector/providers/pancakeswap/pancakeswap';
import { SushiswapProvider } from '../modules/collector/providers/sushiswap/sushiswap';
import { TraderjoeProvider } from '../modules/collector/providers/traderjoe/traderjoe';
import { UniswapProvider } from '../modules/collector/providers/uniswap/uniswap';
import { VvsfinanceProvider } from '../modules/collector/providers/vvsfinance/vvsfinance';

let providers: ShareProviders;
const timestamp = getTodayUTCTimestamp();

describe('Collector', async function () {
  beforeEach(async function () {
    providers = {
      database: new DatabaseProvider(),
      subgraph: new GraphProvider(),
    };

    await providers.database.connect();
  });

  it('uniswap', async function () {
    const collector = new UniswapProvider(UniswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });

  it('sushiswap', async function () {
    const collector = new SushiswapProvider(SushiswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });
  it('traderjoe', async function () {
    const collector = new TraderjoeProvider({
      name: 'traderjoe',
      exchange: TraderJoeExchangeConfigs,
      lending: TraderJoeLendingConfigs,
      tokenomics: DefaultTokenList.JOE,
    });
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });

  it('spookyswap', async function () {
    const collector = new UniswapProvider(SpookyswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });

  it('pancakeswap', async function () {
    const collector = new PancakeswapProvider(PancakeswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });

  it('biswap', async function () {
    const collector = new PancakeswapProvider(BiswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });

  it('babyswap', async function () {
    const collector = new PancakeswapProvider(BabyswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });
  it('quickswap', async function () {
    const collector = new UniswapProvider(QuickswapConfigs);
    await collector.getDailyData({
      providers: providers,
      date: getTimestamp(),
    });
    await collector.getDateData({
      providers: providers,
      date: getTodayUTCTimestamp(),
    });
  });
  it('vvsfinance', async function () {
    const collector = new VvsfinanceProvider(VvsfinanceConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });
  it('mmfinance', async function () {
    const collector = new PancakeswapProvider(MmfinanceConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });
  it('katana', async function () {
    const collector = new RoninKatanaProvider(RoninKatanaConfigs);
    await collector.getDailyData({
      providers: providers,
      date: timestamp,
    });
    await collector.getDateData({
      providers: providers,
      date: timestamp,
    });
  });
});
