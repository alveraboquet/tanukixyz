import AaveV2LendingPoolAbi from '../../../core/abi/aave/AaveV2LendingPool.json';
import { LendingPool } from '../types';

export const AaveV2PolygonPools: Array<LendingPool> = [
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'WETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'WMATIC',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'matic-network',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xd6df932a45c0f255f85145f286ea0b292b21c90b', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'AAVE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'GHST',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aavegotchi',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'BAL',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'balancer',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x85955046df4668e1dd369d2de9f3aeb98dd2a369', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'DPI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'defipulse-index',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x172370d5cd63279efa6d502dab29171933a610af', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'CRV',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'curve-dao-token',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'SUSHI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'sushi',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39', // token address
    genesisBlock: 12687245,
    underlyingSymbol: 'LINK',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
];
