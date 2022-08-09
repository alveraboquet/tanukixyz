import { TokenConfig } from '../types';

export const DefaultTokenList: { [key: string]: TokenConfig } = {
  ETH: {
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
      },
      avalanche: {
        decimals: 18,
        address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
      },
      fantom: {
        decimals: 18,
        address: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
      },
      binance: {
        decimals: 18,
        address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      aurora: {
        decimals: 18,
        address: '',
      },
      arbitrum: {
        decimals: 18,
        address: '',
      },
      harmony: {
        decimals: 18,
        address: '',
      },
    },
  },
  AAVE: {
    symbol: 'AAVE',
    coingeckoId: 'aave',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      },
      avalanche: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      arbitrum: {
        decimals: 18,
        address: '',
      },
      harmony: {
        decimals: 18,
        address: '',
      },
    },
  },
  BAT: {
    symbol: 'BAT',
    coingeckoId: 'basic-attention-token',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  COMP: {
    symbol: 'COMP',
    coingeckoId: 'compound-governance-token',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      },
    },
  },
  DAI: {
    symbol: 'DAI',
    coingeckoId: 'dai',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      avalanche: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      arbitrum: {
        decimals: 18,
        address: '',
      },
      harmony: {
        decimals: 18,
        address: '',
      },
    },
  },
  FEI: {
    symbol: 'FEI',
    coingeckoId: 'fei-usd',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
      },
    },
  },
  LINK: {
    symbol: 'LINK',
    coingeckoId: 'chainlink',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      avalanche: {
        decimals: 18,
        address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
      arbitrum: {
        decimals: 18,
        address: '',
      },
      harmony: {
        decimals: 18,
        address: '',
      },
    },
  },
  MKR: {
    symbol: 'MKR',
    coingeckoId: 'maker',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      },
    },
  },
  REP: {
    symbol: 'REP',
    coingeckoId: 'augur',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x221657776846890989a759ba2973e427dff5c9bb',
      },
    },
  },
  SAI: {
    symbol: 'SAI',
    coingeckoId: 'dai',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
      },
    },
  },
  SUSHI: {
    symbol: 'SUSHI',
    coingeckoId: 'sushi',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  TUSD: {
    symbol: 'TUSD',
    coingeckoId: 'true-usd',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x0000000000085d4780B73119b644AE5ecd22b376',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '0x14016e85a25aeb13065688cafb43044c2ef86784',
      },
    },
  },
  UNI: {
    symbol: 'UNI',
    coingeckoId: 'uniswap',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  USDC: {
    symbol: 'USDC',
    coingeckoId: 'usd-coin',
    chains: {
      ethereum: {
        decimals: 6,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      avalanche: {
        decimals: 6,
        address: '',
      },
      fantom: {
        decimals: 6,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      },
      polygon: {
        decimals: 6,
        address: '',
      },
      aurora: {
        decimals: 6,
        address: '',
      },
      arbitrum: {
        decimals: 6,
        address: '',
      },
      harmony: {
        decimals: 6,
        address: '',
      },
    },
  },
  USDP: {
    symbol: 'USDP',
    coingeckoId: 'paxos-standard',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
      },
    },
  },
  USDT: {
    symbol: 'USDT',
    coingeckoId: 'tether',
    chains: {
      ethereum: {
        decimals: 6,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      },
      avalanche: {
        decimals: 6,
        address: '',
      },
      fantom: {
        decimals: 6,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '0x55d398326f99059ff775485246999027b3197955',
      },
      polygon: {
        decimals: 6,
        address: '',
      },
      aurora: {
        decimals: 6,
        address: '',
      },
      arbitrum: {
        decimals: 6,
        address: '',
      },
      harmony: {
        decimals: 6,
        address: '',
      },
    },
  },
  WBTC: {
    symbol: 'WBTC',
    coingeckoId: 'bitcoin',
    chains: {
      ethereum: {
        decimals: 8,
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      },
      avalanche: {
        decimals: 8,
        address: '',
      },
      fantom: {
        decimals: 8,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      },
      polygon: {
        decimals: 8,
        address: '',
      },
      aurora: {
        decimals: 8,
        address: '',
      },
      arbitrum: {
        decimals: 8,
        address: '',
      },
      harmony: {
        decimals: 8,
        address: '',
      },
    },
  },
  YFI: {
    symbol: 'YFI',
    coingeckoId: 'yearn-finance',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  ZRX: {
    symbol: 'ZRX',
    coingeckoId: '0x',
    chains: {
      ethereum: {
        decimals: 18,
        address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      },
    },
  },
  DPI: {
    symbol: 'DPI',
    coingeckoId: 'defipulse-index',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  CRV: {
    symbol: 'CRV',
    coingeckoId: 'curve-dao-token',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
    },
  },
  SNX: {
    symbol: 'SNX',
    coingeckoId: 'havven',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  CVX: {
    symbol: 'CVX',
    coingeckoId: 'convex-finance',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  EURS: {
    symbol: 'EURS',
    coingeckoId: 'stasis-eurs',
    chains: {
      ethereum: {
        decimals: 2,
        address: '',
      },
    },
  },
  CREAM: {
    symbol: 'CREAM',
    coingeckoId: 'cream-2',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  BUSD: {
    symbol: 'BUSD',
    coingeckoId: 'binance-usd',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      },
    },
  },
  MIM: {
    symbol: 'MIM',
    coingeckoId: 'magic-internet-money',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      avalanche: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
    },
  },
  AVAX: {
    symbol: 'AVAX',
    coingeckoId: 'avalanche-2',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      avalanche: {
        decimals: 18,
        address: '',
      },
    },
  },
  FTM: {
    symbol: 'FTM',
    coingeckoId: 'fantom',
    chains: {
      fantom: {
        decimals: 18,
        address: '',
      },
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  ALPHA: {
    symbol: 'ALPHA',
    coingeckoId: 'alpha-finance',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      avalanche: {
        decimals: 18,
        address: '',
      },
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  FRAX: {
    symbol: 'FRAX',
    coingeckoId: 'frax',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      fantom: {
        decimals: 18,
        address: '',
      },
    },
  },
  FXS: {
    symbol: 'FXS',
    coingeckoId: 'frax-share',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  BNB: {
    symbol: 'BNB',
    coingeckoId: 'binancecoin',
    chains: {
      binance: {
        decimals: 18,
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
      },
    },
  },
  CAKE: {
    symbol: 'CAKE',
    coingeckoId: 'pancakeswap-token',
    chains: {
      binance: {
        decimals: 18,
        address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      },
    },
  },
  SXP: {
    symbol: 'SXP',
    coingeckoId: 'swipe',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  LTC: {
    symbol: 'LTC',
    coingeckoId: 'litecoin',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  DOT: {
    symbol: 'DOT',
    coingeckoId: 'polkadot',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  XVS: {
    symbol: 'XVS',
    coingeckoId: 'venus',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  XRP: {
    symbol: 'XRP',
    coingeckoId: 'ripple',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  TRX: {
    symbol: 'TRX',
    coingeckoId: 'tron',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  MATIC: {
    symbol: 'MATIC',
    coingeckoId: 'matic-network',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  DOGE: {
    symbol: 'DOGE',
    coingeckoId: 'dogecoin',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  BCH: {
    symbol: 'BCH',
    coingeckoId: 'bitcoin-cash',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  QUICK: {
    symbol: 'QUICK',
    coingeckoId: 'quickswap',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  BBTC: {
    symbol: 'BBTC',
    coingeckoId: 'bitcoin',
    chains: {
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  ADA: {
    symbol: 'ADA',
    coingeckoId: 'cardano',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  BAND: {
    symbol: 'BAND',
    coingeckoId: 'band-protocol',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  EOS: {
    symbol: 'EOS',
    coingeckoId: 'eos',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  XTZ: {
    symbol: 'XTZ',
    coingeckoId: 'tezos',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  FIL: {
    symbol: 'FIL',
    coingeckoId: 'filecoin',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  ATOM: {
    symbol: 'ATOM',
    coingeckoId: 'cosmos',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  TWT: {
    symbol: 'TWT',
    coingeckoId: 'trust-wallet-token',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  VAI: {
    symbol: 'VAI',
    coingeckoId: 'vai',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  AUTO: {
    symbol: 'AUTO',
    coingeckoId: 'auto',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  renBTC: {
    symbol: 'renBTC',
    coingeckoId: 'bitcoin',
    chains: {
      binance: {
        decimals: 8,
        address: '',
      },
    },
  },
  IOTX: {
    symbol: 'IOTX',
    coingeckoId: 'iotex',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  sAVAX: {
    symbol: 'sAVAX',
    coingeckoId: 'benqi-liquid-staked-avax',
    chains: {
      avalanche: {
        decimals: 18,
        address: '',
      },
    },
  },
  QI: {
    symbol: 'QI',
    coingeckoId: 'benqi',
    chains: {
      avalanche: {
        decimals: 18,
        address: '',
      },
    },
  },
  NEAR: {
    symbol: 'NEAR',
    coingeckoId: 'near',
    chains: {
      aurora: {
        decimals: 24,
        address: '',
      },
    },
  },
  BSTN: {
    symbol: 'BSTN',
    coingeckoId: 'bastion-protocol',
    chains: {
      aurora: {
        decimals: 18,
        address: '',
      },
    },
  },
  stNEAR: {
    symbol: 'stNEAR',
    coingeckoId: 'staked-near',
    chains: {
      aurora: {
        decimals: 24,
        address: '',
      },
    },
  },
  AURORA: {
    symbol: 'AURORA',
    coingeckoId: 'aurora-near',
    chains: {
      aurora: {
        decimals: 18,
        address: '',
      },
    },
  },
  TRI: {
    symbol: 'TRI',
    coingeckoId: 'trisolaris',
    chains: {
      aurora: {
        decimals: 18,
        address: '',
      },
    },
  },
  PLY: {
    symbol: 'PLY',
    coingeckoId: 'aurigami',
    chains: {
      aurora: {
        decimals: 18,
        address: '',
      },
    },
  },
  EUL: {
    symbol: 'EUL',
    coingeckoId: 'euler',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  IB: {
    symbol: 'IB',
    coingeckoId: 'iron-bank',
    chains: {
      fantom: {
        decimals: 18,
        address: '',
      },
    },
  },
  LQTY: {
    symbol: 'LQTY',
    coingeckoId: 'liquity',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  BOO: {
    symbol: 'BOO',
    coingeckoId: 'spookyswap',
    chains: {
      fantom: {
        decimals: 18,
        address: '',
      },
    },
  },
  JOE: {
    symbol: 'JOE',
    coingeckoId: 'joe',
    chains: {
      avalanche: {
        decimals: 18,
        address: '',
      },
    },
  },
  BAL: {
    symbol: 'BAL',
    coingeckoId: 'balancer',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
      polygon: {
        decimals: 18,
        address: '',
      },
    },
  },
  BSW: {
    symbol: 'BSW',
    coingeckoId: 'biswap',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  BABY: {
    symbol: 'BABY',
    coingeckoId: 'babyswap',
    chains: {
      binance: {
        decimals: 18,
        address: '',
      },
    },
  },
  MMF: {
    symbol: 'MMF',
    coingeckoId: 'mmfinance',
    chains: {
      cronos: {
        decimals: 18,
        address: '',
      },
    },
  },
  REF: {
    symbol: 'REF',
    coingeckoId: 'ref-finance',
    chains: {
      near: {
        decimals: 24,
        address: '',
      },
    },
  },
  ONE: {
    symbol: 'ONE',
    coingeckoId: 'harmony',
    chains: {
      harmony: {
        decimals: 18,
        address: '',
      },
    },
  },
  ENS: {
    symbol: 'ENS',
    coingeckoId: 'ethereum-name-service',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
};
