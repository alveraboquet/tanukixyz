import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const TectoticCronosPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 570297,
    poolAddress: '0xeadf7c01da7e93fdb5f16b0aa9ee85f978e89e95',
    underlyingSymbol: 'CRO',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'crypto-com-chain',
  },
  {
    abi: LendToken,
    genesisBlock: 570296,
    poolAddress: '0x543F4Db9BD26C9Eb6aD4DD1C33522c966C625774',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 570293,
    poolAddress: '0x67fD498E94d95972a4A2a44AccE00a000AF7Fe00',
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 570291,
    poolAddress: '0xB3bbf1bE947b245Aef26e3B6a9D777d7703F4c8e',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 671825,
    poolAddress: '0xA683fdfD9286eeDfeA81CF6dA14703DA683c44E5',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 671699,
    poolAddress: '0xE1c4c56f772686909c28C319079D41adFD6ec89b',
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: LendToken,
    genesisBlock: 1337195,
    poolAddress: '0xfe6934FDf050854749945921fAA83191Bccf20Ad',
    underlyingSymbol: 'TONIC',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'tectonic',
  },
];
