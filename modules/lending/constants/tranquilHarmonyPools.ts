import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const TranquilHarmonyPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 18451365,
    poolAddress: '0x34B9aa82D89AE04f0f546Ca5eC9C93eFE1288940',
    underlyingSymbol: 'ONE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'harmony',
  },
  {
    abi: LendToken,
    genesisBlock: 20636438,
    poolAddress: '0x973f22036A0fF3A93654e7829444ec64CB37BD78',
    underlyingSymbol: 'stONE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'tranquil-staked-one',
  },
  {
    abi: LendToken,
    genesisBlock: 18451368,
    poolAddress: '0xd9c0D8Ad06ABE10aB29655ff98DcAAA0E059184A',
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 18451373,
    poolAddress: '0xc63AB8c72e636C9961c5e9288b697eC5F0B8E1F7',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 18451377,
    poolAddress: '0xCa3e902eFdb2a410C952Fd3e4ac38d7DBDCB8E96',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 18451383,
    poolAddress: '0x7af2430eFa179dB0e76257E5208bCAf2407B2468',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 22698736,
    poolAddress: '0x49d95736FE7f1F32E3ee5deFc26c95bA22834639',
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
];
