import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const AurigamiAuroraPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 60501625,
    poolAddress: '0xca9511B610bA5fc7E311FDeF9cE16050eE4449E9',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 60501576,
    poolAddress: '0x4f0d864b1ABf4B701799a0b30b57A22dFEB5917b',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 60501670,
    poolAddress: '0xCFb6b0498cb7555e7e21502E0F449bf28760Adbb',
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 60501723,
    poolAddress: '0xaD5A2437Ff55ed7A8Cad3b797b3eC7c5a19B1c54',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 60501833,
    poolAddress: '0xaE4fac24dCdAE0132C6d04f564dCf059616E9423',
    underlyingSymbol: 'NEAR',
    underlyingDecimals: 24,
    underlyingCoingeckoId: 'near',
  },
  {
    abi: LendToken,
    genesisBlock: 61136018,
    poolAddress: '0x3195949f267702723bc614cAE037cdc8D1E94786',
    underlyingSymbol: 'stNEAR',
    underlyingDecimals: 24,
    underlyingCoingeckoId: 'staked-near',
  },
  {
    abi: LendToken,
    genesisBlock: 61136025,
    poolAddress: '0x8888682E24dd4Df7B7Ff2B91fccB575737E433bf',
    underlyingSymbol: 'AURORA',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aurora-near',
  },
  {
    abi: LendToken,
    genesisBlock: 61842631,
    poolAddress: '0x6Ea6C03061bDdCE23d4Ec60B6E6e880c33d24dca',
    underlyingSymbol: 'TRI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'trisolaris',
  },
];
