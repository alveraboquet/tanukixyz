import AaveV3LendingPoolAbi from '../../../core/abi/aave/AaveV3LendingPool.json';
import { LendingPool } from '../types';

export const AaveV3ArbitrumPools: Array<LendingPool> = [
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xf97f4df75117a78c1a5a0dbb814af92458539fb4', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'LINK',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'WETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xba5ddd1f9d7f570dc94a51479a000e3bce967196', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'AAVE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xd22a58f79e9481d1a88e00c343885a588b34b68b', // token address
    genesisBlock: 7742429,
    underlyingSymbol: 'EURS',
    underlyingDecimals: 2,
    underlyingCoingeckoId: 'stasis-eurs',
  },
];
