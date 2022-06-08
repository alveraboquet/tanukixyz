import { getChainConfig } from '../../../core/constants/chains';
import { IDexProvider } from '../types';
import { BalancerProvider } from './balancer';
import { CurveProvider } from './curve';
import { KatanaProvider } from './katana';
import { NetSwapProvider } from './netswap';
import { PancakeSwapProvider } from './pancakeswap';
import { PangolinProvider } from './pangolin';
import { SpiritSwapProvider } from './spiritswap';
import { SUSHISWAP_BIRTHDAY, SUSHISWAP_SUBGRAPH } from './sushiswap/constants';
import { SushiswapProvider } from './sushiswap/sushiswap';
import { UniswapProvider } from './uniswap/uniswap';
import { UniswapV2Provider } from './uniswap/uniswapv2';

export const DexProviders: { [key: string]: IDexProvider | null } = {
  uniswap: new UniswapProvider(),
  sushiswap: new SushiswapProvider({
    name: 'sushiswap',
    subgraph: SUSHISWAP_SUBGRAPH,
    birthday: SUSHISWAP_BIRTHDAY,
  }),
  curve: new CurveProvider({
    name: 'curve',
    subgraph: [
      {
        blocks: getChainConfig('ethereum').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
      },
    ],
    birthday: 0,
  }),
  spookyswap: new UniswapV2Provider({
    name: 'spookyswap',
    subgraph: [
      {
        blocks: getChainConfig('fantom').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/eerieeight/spookyswap',
      },
    ],
    birthday: 1618704000,
  }),
  traderjoe: new SushiswapProvider({
    name: 'traderjoe',
    subgraph: [
      {
        blocks: getChainConfig('avalanche').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange',
      },
    ],
    birthday: 1628467200,
  }),
  spiritswap: new SpiritSwapProvider({
    name: 'spiritswap',
    subgraph: [
      {
        blocks: getChainConfig('fantom').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics',
      },
    ],
    birthday: 1619308800,
  }),
  solidly: new UniswapV2Provider({
    name: 'solidly',
    subgraph: [
      {
        blocks: getChainConfig('fantom').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/spartacus-finance/solidly',
      },
    ],
    birthday: 1644451200,
  }),
  pangolin: new PangolinProvider({
    name: 'pangolin',
    subgraph: [
      {
        blocks: getChainConfig('avalanche').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/pangolindex/exchange',
      },
    ],
    birthday: 1612742400,
  }),
  pancakeswap: new PancakeSwapProvider({
    name: 'pancakeswap',
    subgraph: [
      {
        blocks: getChainConfig('binance').blockSubgraph as string,
        exchange: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
      },
    ],
    birthday: 1619136000,
  }),
  apeswap: new UniswapV2Provider({
    name: 'apeswap',
    subgraph: [
      {
        blocks: getChainConfig('binance').blockSubgraph as string,
        exchange: 'https://graph.apeswap.finance/subgraphs/name/ape-swap/apeswap-subgraph',
      },
    ],
    birthday: 1613174400,
  }),
  biswap: new PancakeSwapProvider({
    name: 'biswap',
    subgraph: [
      {
        blocks: getChainConfig('binance').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/biswapcom/exchange5',
      },
    ],
    birthday: 1633046400,
  }),
  babyswap: new PancakeSwapProvider({
    name: 'babyswap',
    subgraph: [
      {
        blocks: getChainConfig('binance').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/babyswapgraph/exchange2',
      },
    ],
    birthday: 1622505600,
  }),
  quickswap: new UniswapV2Provider({
    name: 'quickswap',
    subgraph: [
      {
        blocks: getChainConfig('polygon').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
      },
    ],
    birthday: 1602115200,
  }),
  netswap: new NetSwapProvider({
    name: 'netswap',
    subgraph: [
      {
        blocks: getChainConfig('metis').blockSubgraph as string,
        exchange: 'https://api.netswap.io/graph/subgraphs/name/netswap/exchange',
      },
    ],
    birthday: 1640995200,
  }),
  tethys: new UniswapV2Provider({
    name: 'tethys',
    subgraph: [
      {
        blocks: getChainConfig('metis').blockSubgraph as string,
        exchange: 'https://node.tethys.finance/subgraphs/name/tethys',
      },
    ],
    birthday: 1640995200,
  }),
  mmfinance: new PancakeSwapProvider({
    name: 'mmfinance',
    subgraph: [
      {
        blocks: getChainConfig('cronos').blockSubgraph as string,
        exchange: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/exchange',
      },
    ],
    birthday: 1639008000,
  }),
  katana: new KatanaProvider({
    name: 'katana',
    subgraph: [
      {
        blocks: getChainConfig('ronin').blockSubgraph as string,
        exchange: 'https://thegraph.roninchain.com/subgraphs/name/axieinfinity/katana-subgraph-blue',
      },
    ],
    birthday: 1635811200,
  }),
  swappi: new UniswapV2Provider({
    name: 'swappi',
    subgraph: [
      {
        blocks: getChainConfig('conflux').blockSubgraph as string,
        exchange: 'https://graphql.swappi.io/subgraphs/name/swappi-dex/swappi',
      },
    ],
    birthday: 1649203200,
  }),
  balancer: new BalancerProvider({
    name: 'balancer',
    subgraph: [
      {
        blocks: getChainConfig('ethereum').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
      },
      {
        blocks: getChainConfig('polygon').blockSubgraph as string,
        exchange: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
      },
    ],
    birthday: 1618963200,
  }),
  beets: new BalancerProvider({
    name: 'beets',
    subgraph: [
      {
        blocks: getChainConfig('fantom').blockSubgraph as string,
        exchange: 'https://graph-node.beets-ftm-node.com/subgraphs/name/beethovenx',
      },
    ],
    birthday: 1632009600,
  }),
};
