import AaveV3LendingPoolAbi from '../../../core/abi/aave/AaveV3LendingPool.json';
import { LendingPool } from '../types';

export const AaveV3AvaxPools: Array<LendingPool> = [
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'DAI.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x5947bb275c521040051d82396192181b413227a3', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'LINK.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x50b7545627a5162f82a992c33b87adc75187b218', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'WBTC.e',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'WETH.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x63a72806098bd3d9520cc43356dd78afe5d386d9', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'AAVE.e',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // token address
    genesisBlock: 11970506,
    underlyingSymbol: 'WAVAX',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'avalanche-2',
  },
];
