import { DefaultTokenList } from '../../../../configs/constants/defaultTokenList';
import { TokenConfig } from '../../../../configs/types';

export const ReserveMap: { [key: string]: TokenConfig } = {
  // ethereum
  '0x6b175474e89094c44da98b954eedeac495271d0f': DefaultTokenList.DAI,
  '0x0000000000085d4780b73119b644ae5ecd22b376': DefaultTokenList.TUSD,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': DefaultTokenList.USDC,
  '0xdac17f958d2ee523a2206206994597c13d831ec7': DefaultTokenList.USDT,
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51': {
    symbol: 'sUSD',
    coingeckoId: 'nusd',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef': DefaultTokenList.BAT,
  '0x514910771af9ca656af840dff83e8264ecf986ca': DefaultTokenList.LINK,
  '0x1985365e9f78359a9b6ad760e32412f4a445e862': DefaultTokenList.REP,
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': DefaultTokenList.MKR,
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942': {
    symbol: 'MANA',
    coingeckoId: 'decentraland',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xe41d2489571d322189246dafa5ebde1f4699f498': DefaultTokenList.ZRX,
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': DefaultTokenList.SNX,
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': DefaultTokenList.WBTC,
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': DefaultTokenList.BUSD,
  '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c': {
    symbol: 'ENJ',
    coingeckoId: 'enjincoin',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e': DefaultTokenList.YFI,
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': DefaultTokenList.AAVE,
  '0x80fb784b7ed66730e8b1dbd9820afd29931aab03': {
    symbol: 'LEND',
    coingeckoId: 'ethlend',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': DefaultTokenList.UNI,
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': DefaultTokenList.ETH,
  '0xd533a949740bb3306d119cc777fa900ba034cd52': DefaultTokenList.CRV,
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': {
    symbol: 'GUSD',
    coingeckoId: 'gemini-dollar',
    chains: {
      ethereum: {
        decimals: 2,
        address: '',
      },
    },
  },
  '0xba100000625a3754423978a60c9317c58a424e3d': DefaultTokenList.BAL,
  '0x8798249c2e607446efb7ad49ec89dd1865ff4272': {
    symbol: 'xSUSHI',
    coingeckoId: 'xsushi',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5': {
    symbol: 'renFIL',
    coingeckoId: 'renfil',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919': {
    symbol: 'RAI',
    coingeckoId: 'rai',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xd46ba6d942050d489dbd938a2c909a5d5039a161': {
    symbol: 'AMPL',
    coingeckoId: 'ampleforth',
    chains: {
      ethereum: {
        decimals: 9,
        address: '',
      },
    },
  },
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1': DefaultTokenList.USDP,
  '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b': DefaultTokenList.DPI,
  '0x853d955acef822db058eb8505911ed77f175b99e': DefaultTokenList.FRAX,
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca': DefaultTokenList.FEI,
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': {
    symbol: 'stETH',
    coingeckoId: 'staked-ether',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': {
    symbol: 'ENS',
    coingeckoId: 'ethereum-name-service',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200': {
    symbol: 'KNC',
    coingeckoId: 'kyber-network-crystal',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x408e41876cccdc0f92210600ef50372656052a38': {
    symbol: 'REN',
    coingeckoId: 'republic-protocol',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xa693b19d2931d498c5b318df961919bb4aee87a5': {
    symbol: 'UST',
    coingeckoId: 'terrausd',
    chains: {
      ethereum: {
        decimals: 6,
        address: '',
      },
    },
  },
  '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b': DefaultTokenList.CVX,
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': DefaultTokenList.ETH,
  '0x111111111117dc0aa78b770fa6a738034120c302': {
    symbol: '1INCH',
    coingeckoId: '1inch',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },

  // polygon
  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': DefaultTokenList.DAI,
  '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': DefaultTokenList.LINK,
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': DefaultTokenList.USDC,
  '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': DefaultTokenList.WBTC,
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': DefaultTokenList.ETH,
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': DefaultTokenList.USDT,
  '0xd6df932a45c0f255f85145f286ea0b292b21c90b': DefaultTokenList.AAVE,
  '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': DefaultTokenList.MATIC,
  '0x172370d5cd63279efa6d502dab29171933a610af': DefaultTokenList.CRV,
  '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a': DefaultTokenList.SUSHI,
  '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7': {
    symbol: 'GHST',
    coingeckoId: 'aavegotchi',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3': DefaultTokenList.BAL,
  '0x85955046df4668e1dd369d2de9f3aeb98dd2a369': DefaultTokenList.DPI,
  '0xe111178a87a3bff0c8d18decba5798827539ae99': {
    symbol: 'EURS',
    coingeckoId: 'stasis-eurs',
    chains: {
      polygon: {
        decimals: 2,
        address: '',
      },
    },
  },
  '0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c': {
    symbol: 'jEUR',
    coingeckoId: 'jarvis-synthetic-euro',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4': {
    symbol: 'agEUR',
    coingeckoId: 'ageur',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },

  // avalanche
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab': DefaultTokenList.ETH,
  '0xd586e7f844cea2f87f50152665bcbc2c279d8d70': DefaultTokenList.DAI,
  '0xc7198437980c041c805a1edcba50c1ce5db95118': DefaultTokenList.USDT,
  '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664': DefaultTokenList.USDC,
  '0x63a72806098bd3d9520cc43356dd78afe5d386d9': DefaultTokenList.AAVE,
  '0x50b7545627a5162f82a992c33b87adc75187b218': DefaultTokenList.WBTC,
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': DefaultTokenList.AVAX,
  '0x5947bb275c521040051d82396192181b413227a3': DefaultTokenList.LINK,
  '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7': DefaultTokenList.USDT,
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': DefaultTokenList.USDC,
  '0x2b2c81e08f1af8835a78bb2a90ae924ace0ea4be': {
    symbol: 'sAVAX',
    coingeckoId: 'benqi-liquid-staked-avax',
    chains: {
      avalanche: {
        decimals: 18,
        address: '',
      },
    },
  },

  // fantom
  '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83': DefaultTokenList.FTM,
  '0x04068da6c83afcfa0e13ba15a6696662335d5b75': DefaultTokenList.USDC,
  '0x049d68029688eabf473097a2fc38ef61633a3c7a': DefaultTokenList.USDT,
  '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B': DefaultTokenList.AAVE,
  '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e': DefaultTokenList.DAI,
  '0x321162Cd933E2Be498Cd2267a90534A804051b11': DefaultTokenList.WBTC,
  '0x1E4F97b9f9F913c46F1632781732927B9019C68b': DefaultTokenList.CRV,
  '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8': DefaultTokenList.LINK,
  '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC': DefaultTokenList.SUSHI,
  '0x74b23882a30290451a17c44f4f05243b6b58c76d': DefaultTokenList.ETH,

  // arbitrum
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': DefaultTokenList.DAI,
  '0xf97f4df75117a78c1a5a0dbb814af92458539fb4': DefaultTokenList.LINK,
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': DefaultTokenList.USDC,
  '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': DefaultTokenList.WBTC,
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': DefaultTokenList.ETH,
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': DefaultTokenList.USDT,
  '0xba5ddd1f9d7f570dc94a51479a000e3bce967196': DefaultTokenList.AAVE,
  '0xd22a58f79e9481d1a88e00c343885a588b34b68b': {
    symbol: 'EURS',
    coingeckoId: 'stasis-eurs',
    chains: {
      arbitrum: {
        decimals: 2,
        address: '',
      },
    },
  },

  // harmony
  '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a': DefaultTokenList.ONE,
  '0xef977d2f931c1978db5f6747666fa1eacb0d0339': DefaultTokenList.DAI,
  '0x218532a12a389a4a92fc0c5fb22901d1c19198aa': DefaultTokenList.LINK,
  '0x985458e523db3d53125813ed68c274899e9dfab4': DefaultTokenList.USDC,
  '0x6983d1e6def3690c4d616b13597a09e6193ea013': DefaultTokenList.ETH,
  '0x3095c7557bcb296ccc6e363de01b760ba031f2d9': DefaultTokenList.WBTC,
  '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f': DefaultTokenList.USDT,
  '0xcf323aad9e522b93f11c352caa519ad0e14eb40f': DefaultTokenList.AAVE,

  // optimism
  // '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': DefaultTokenList.DAI,
  '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6': DefaultTokenList.LINK,
  '0x7f5c764cbc14f9669b88837ca1490cca17c31607': DefaultTokenList.USDC,
  '0x68f180fcce6836688e9084f035309e29bf0a2095': DefaultTokenList.WBTC,
  '0x4200000000000000000000000000000000000006': DefaultTokenList.ETH,
  '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': DefaultTokenList.USDT,
  '0x76fb31fb4af56892a25e32cfc43de717950c9278': DefaultTokenList.AAVE,
  '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9': {
    symbol: 'sUSD',
    coingeckoId: 'nusd',
    chains: {
      optimism: {
        decimals: 18,
        address: '',
      },
    },
  },
};
