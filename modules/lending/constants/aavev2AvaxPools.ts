import AaveV2LendingPoolAbi from '../../../core/abi/aave/AaveV2LendingPool.json';
import { LendingPool } from '../types';

export const AaveV2AvaxPools: Array<LendingPool> = [
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'WETH.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'DAI.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'USDT.e',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'USDC.e',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x63a72806098bd3d9520cc43356dd78afe5d386d9', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'AAVE.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0x50b7545627a5162f82a992c33b87adc75187b218', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'WBTC.e',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV2LendingPoolAbi,
    poolAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // token address
    genesisBlock: 4607005,
    underlyingSymbol: 'WAVAX',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'avalanche-2',
  },
];
