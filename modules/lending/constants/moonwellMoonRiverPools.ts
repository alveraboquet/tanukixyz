import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const MoonWellMoonRiverPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 1462009,
    poolAddress: '0x6a1A771C7826596652daDC9145fEAaE62b1cd07f',
    underlyingSymbol: 'MOVR',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'moonriver',
  },
  {
    abi: LendToken,
    genesisBlock: 1462013,
    poolAddress: '0x6503D905338e2ebB550c9eC39Ced525b612E77aE',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 1462014,
    poolAddress: '0xd0670AEe3698F66e2D4dAf071EB9c690d978BFA8',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 1462015,
    poolAddress: '0x36918B66F9A3eC7a59d0007D8458DB17bDffBF21',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 1462017,
    poolAddress: '0x93Ef8B7c6171BaB1C0A51092B2c9da8dc2ba0e9D',
    underlyingSymbol: 'FRAX',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'frax',
  },
  {
    abi: LendToken,
    genesisBlock: 1462011,
    poolAddress: '0x6E745367F4Ad2b3da7339aee65dC85d416614D90',
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
];
