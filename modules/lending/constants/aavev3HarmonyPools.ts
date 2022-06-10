import AaveV3LendingPoolAbi from '../../../core/abi/aave/AaveV3LendingPool.json';
import { LendingPool } from '../types';

export const AaveV3HarmonyPools: Array<LendingPool> = [
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x985458E523dB3d53125813eD68c274899e9DfAb4', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x218532a12a389a4a92fC0C5Fb22901D1c19198aA', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'LINK',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x3095c7557bcb296ccc6e363de01b760ba031f2d9', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x6983d1e6def3690c4d616b13597a09e6193ea013', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xcf323aad9e522b93f11c352caa519ad0e14eb40f', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'AAVE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // token address
    genesisBlock: 23930374,
    underlyingSymbol: 'WONE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'harmony',
  },
];
