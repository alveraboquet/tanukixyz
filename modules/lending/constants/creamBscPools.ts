import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const CreamBscPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 381405,
    poolAddress: '0x1ffe17b99b439be0afc831239ddecda2a790ff3a',
    underlyingSymbol: 'BNB',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'binancecoin',
  },
  {
    abi: LendToken,
    genesisBlock: 6366659,
    poolAddress: '0x15cc701370cb8ada2a2b6f4226ec5cf6aa93bc67',
    underlyingSymbol: 'WBNB',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'binancecoin',
  },
  {
    abi: LendToken,
    genesisBlock: 409592,
    poolAddress: '0x2bc4eb013ddee29d37920938b96d353171289b7c',
    underlyingSymbol: 'BUSD',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'binance-usd',
  },
  {
    abi: LendToken,
    genesisBlock: 390059,
    poolAddress: '0x11883Cdea6bAb720092791cc89affa54428Ce069',
    underlyingSymbol: 'BTCB',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 387800,
    poolAddress: '0xAa46e2c21B7763a73DB48e9b318899253E66e20C',
    underlyingSymbol: 'XRP',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ripple',
  },
  {
    abi: LendToken,
    genesisBlock: 390062,
    poolAddress: '0xCb87Cee8c77CdFD310fb3C58ff72e688d46f90b1',
    underlyingSymbol: 'BCH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'bitcoin-cash',
  },
  {
    abi: LendToken,
    genesisBlock: 390094,
    poolAddress: '0xb31f5d117541825D6692c10e4357008EDF3E2BCD',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 387810,
    poolAddress: '0x8cc7E2a6de999758499658bB702143FD025E09B2',
    underlyingSymbol: 'LTC',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'litecoin',
  },
  {
    abi: LendToken,
    genesisBlock: 409595,
    poolAddress: '0xEF6d459FE81C3Ed53d292c936b2df5a8084975De',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 440436,
    poolAddress: '0x3942936782d788ce69155F776A51A5F1C9dd9B22',
    underlyingSymbol: 'LINK',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
  {
    abi: LendToken,
    genesisBlock: 475091,
    poolAddress: '0x53D88d2ffDBE71E81D95b08AE0cA49D0C4A8515f',
    underlyingSymbol: 'DOT',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'polkadot',
  },
  {
    abi: LendToken,
    genesisBlock: 980308,
    poolAddress: '0x81c15d3e956e55e77e1f3f257f0a65bd2725fc55',
    underlyingSymbol: 'ADA',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'cardano',
  },
  {
    abi: LendToken,
    genesisBlock: 956825,
    poolAddress: '0x426D6D53187be3288fe37f214e3F6901D8145b62',
    underlyingSymbol: 'CREAM',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'cream-2',
  },
  {
    abi: LendToken,
    genesisBlock: 1079981,
    poolAddress: '0x738f3810b3dA0F3e6dC8C689D0d72f3b4992c43b',
    underlyingSymbol: 'BAND',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'band-protocol',
  },
  {
    abi: LendToken,
    genesisBlock: 1153527,
    poolAddress: '0x19ee64850862cfd234e20c0db4eda286f12ec907',
    underlyingSymbol: 'EOS',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'eos',
  },
  {
    abi: LendToken,
    genesisBlock: 1281865,
    poolAddress: '0x9095e8d707e40982affce41c61c10895157a1b22',
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: LendToken,
    genesisBlock: 1339838,
    poolAddress: '0xe692714717a89e4f2ab89dd17d8dddd7bb52de8e',
    underlyingSymbol: 'XTZ',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'tezos',
  },
  {
    abi: LendToken,
    genesisBlock: 1430958,
    poolAddress: '0x1af8c1c3ad36a041cb6678fed86b1e095004fd16',
    underlyingSymbol: 'FIL',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'filecoin',
  },
  {
    abi: LendToken,
    genesisBlock: 1450889,
    poolAddress: '0xea466cd2583a0290b9e7b987a769a7eb468fb0a5',
    underlyingSymbol: 'YFI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'yearn-finance',
  },
  {
    abi: LendToken,
    genesisBlock: 1482674,
    poolAddress: '0x3b0be453a4008ebc2edd457e7bd355f1c5469d68',
    underlyingSymbol: 'UNI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'uniswap',
  },
  {
    abi: LendToken,
    genesisBlock: 1559563,
    poolAddress: '0x0e9d900c884964dc4b26db96ba113825b1a09baa',
    underlyingSymbol: 'ATOM',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'cosmos',
  },
  {
    abi: LendToken,
    genesisBlock: 1583462,
    poolAddress: '0xd83c88db3a6ca4a32fff1603b0f7ddce01f5f727',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 2145466,
    poolAddress: '0x264bc4ea2f45cf6331ad6c3ac8d7257cf487fcbc',
    underlyingSymbol: 'ALPHA',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'alpha-finance',
  },
  {
    abi: LendToken,
    genesisBlock: 2150173,
    poolAddress: '0x2d3bfaDF9BC94E3Ab796029A030e863F1898aA06',
    underlyingSymbol: 'TWT',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'trust-wallet-token',
  },
  {
    abi: LendToken,
    genesisBlock: 4756388,
    poolAddress: '0xbf9b95b78bc42f6cf53ff2a0ce19d607cfe1ff82',
    underlyingSymbol: 'CAKE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'pancakeswap-token',
  },
  {
    abi: LendToken,
    genesisBlock: 4754552,
    poolAddress: '0x4ebdef163ff08ac1d56a89bafefd6c01cc28a48f',
    underlyingSymbol: 'XVS',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'venus',
  },
  {
    abi: LendToken,
    genesisBlock: 5133250,
    poolAddress: '0x4cb7f1f4ad7a6b53802589af3b90612c1674fec4',
    underlyingSymbol: 'BAT',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'basic-attention-token',
  },
  {
    abi: LendToken,
    genesisBlock: 5152009,
    poolAddress: '0x84902bd5ccef97648bf69c5096729a9367043beb',
    underlyingSymbol: 'VAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'vai',
  },
  {
    abi: LendToken,
    genesisBlock: 5131115,
    poolAddress: '0xf77df34f4bf632fb5ca928592a73a29a42bcf0b1',
    underlyingSymbol: 'AUTO',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'auto',
  },
  {
    abi: LendToken,
    genesisBlock: 5157543,
    poolAddress: '0x7f746a80506a4cafa39938f7c08ad59cfa6de418',
    underlyingSymbol: 'renBTC',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 5763660,
    poolAddress: '0xdcf60e349a5aaeeecdd2fb6772931fbf3486ed1c',
    underlyingSymbol: 'BETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 5754394,
    poolAddress: '0xc17c8c5b8bb9456c624f8534fde6cbda2451488c',
    underlyingSymbol: 'IOTX',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'iotex',
  },
  {
    abi: LendToken,
    genesisBlock: 5760768,
    poolAddress: '0xa8d75a0d17d2f4f2f4673975ab8470269d019c96',
    underlyingSymbol: 'SXP',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'swipe',
  },
  {
    abi: LendToken,
    genesisBlock: 5990086,
    poolAddress: '0x9b53e7d5e3f6cc8694840ed6c9f7fee79e7bcee5',
    underlyingSymbol: 'SUSHI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'sushi',
  },
];
