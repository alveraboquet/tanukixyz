import CurveFactoryAbi from '../abi/curve/CurveFactory.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCurvePoolConfig } from '../helpers';
import { CurvePoolConfig, EventIndexConfig, TokenConfig } from '../types';

export interface CurveProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraph: string;
  factories: {
    [key: string]: EventIndexConfig;
  };
  pools: Array<CurvePoolConfig>;
}

export const CurveConfigs: CurveProtocolConfig = {
  name: 'curve',
  tokenomics: DefaultTokenList.CRV,
  subgraph: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
  factories: {
    ethereum: {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: CurveFactoryAbi,
      contractAddress: '0xB9fC157394Af804a3578134A6585C0dc9cc990d4',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['PlainPoolDeployed', 'MetaPoolDeployed'],
    },
  },
  pools: [
    // USDT - WETH - WBTC
    getCurvePoolConfig('ethereum', '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.USDT,
      DefaultTokenList.WBTC,
      DefaultTokenList.ETH,
    ]),
    // DAI - USDT - USDC
    getCurvePoolConfig('ethereum', '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.DAI,
      DefaultTokenList.USDC,
      DefaultTokenList.USDT,
    ]),
    // DAI, USDT, USDC, sUSD
    getCurvePoolConfig('ethereum', '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.DAI,
      DefaultTokenList.USDC,
      DefaultTokenList.USDT,
      {
        symbol: 'sUSD',
        coingeckoId: 'nusd',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
          },
        },
      },
    ]),
    // ETH - sETH
    getCurvePoolConfig('ethereum', '0xc5424b857f758e906013f3555dad202e4bdb4567', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.ETH,
      {
        symbol: 'sETH',
        coingeckoId: 'seth',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
          },
        },
      },
    ]),
    // ETH - aETHc
    getCurvePoolConfig('ethereum', '0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.ETH,
      {
        symbol: 'aETHc',
        coingeckoId: 'ankreth',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
          },
        },
      },
    ]),
    // renBTC - WBTC
    getCurvePoolConfig('ethereum', '0x93054188d876f558f4a66B2EF1d97d16eDf0895B', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.renBTC,
      DefaultTokenList.WBTC,
    ]),
    // renBTC - WBTC - sBTC
    getCurvePoolConfig('ethereum', '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.renBTC,
      DefaultTokenList.WBTC,
      {
        symbol: 'sBTC',
        coingeckoId: 'sbtc',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
          },
        },
      },
    ]),
    // HBTC - WBTC
    getCurvePoolConfig('ethereum', '0x4CA9b3063Ec5866A4B82E437059D2C43d1be596F', GenesisBlocks['ethereum'], 'meta', [
      {
        symbol: 'HBTC',
        coingeckoId: 'huobi-btc',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0x0316eb71485b0ab14103307bf65a021042c6d380',
          },
        },
      },
      DefaultTokenList.WBTC,
    ]),
    // EURS - sEUR
    getCurvePoolConfig('ethereum', '0x0Ce6a5fF5217e38315f87032CF90686C96627CAA', GenesisBlocks['ethereum'], 'meta', [
      {
        symbol: 'EURS',
        coingeckoId: 'stasis-eurs',
        chains: {
          ethereum: {
            decimals: 2,
            address: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
          },
        },
      },
      {
        symbol: 'sEUR',
        coingeckoId: 'seur',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0xd71ecff9342a5ced620049e616c5035f1db98620',
          },
        },
      },
    ]),
    // EURS - USDC
    getCurvePoolConfig('ethereum', '0x98a7F18d4E56Cfe84E3D081B40001B3d5bD3eB8B', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.USDC,
      {
        symbol: 'EURS',
        coingeckoId: 'stasis-eurs',
        chains: {
          ethereum: {
            decimals: 2,
            address: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
          },
        },
      },
    ]),
    // CRV - ETH
    getCurvePoolConfig('ethereum', '0x8301AE4fc9c624d1D396cbDAa1ed877821D7C511', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.ETH,
      DefaultTokenList.CRV,
    ]),
    // LINK - sLINK
    getCurvePoolConfig('ethereum', '0xF178C0b5Bb7e7aBF4e12A4838C7b7c5bA2C623c0', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.LINK,
      {
        symbol: 'sLINK',
        coingeckoId: 'chainlink',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0xbBC455cb4F1B9e4bFC4B73970d360c8f032EfEE6',
          },
        },
      },
    ]),
    // GUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'GUSD',
          coingeckoId: 'gemini-dollar',
          chains: {
            ethereum: {
              decimals: 2,
              address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
            },
          },
        },
      ]
    ),
    // HUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x3eF6A01A0f81D6046290f3e2A8c5b843e738E604',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'HUSD',
          coingeckoId: 'husd',
          chains: {
            ethereum: {
              decimals: 8,
              address: '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
            },
          },
        },
      ]
    ),
    // USDK - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'USDK',
          coingeckoId: 'usdk',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x1c48f86ae57291f7686349f12601910bd8d470bb',
            },
          },
        },
      ]
    ),
    // USDN - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x0f9cb53Ebe405d49A0bbdBD291A65Ff571bC83e1',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'USDN',
          coingeckoId: 'neutrino',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x674c6ad92fd080e4004b2312b45f796a192d27a0',
            },
          },
        },
      ]
    ),
    // mUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'mUSD',
          coingeckoId: 'musd',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
            },
          },
        },
      ]
    ),
    // TUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0xecd5e75afb02efa118af914515d6521aabd189f1',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [DefaultTokenList.TUSD]
    ),
    // FRAX - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [DefaultTokenList.FRAX]
    ),
    // LUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'LUSD',
          coingeckoId: 'liquity-usd',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
            },
          },
        },
      ]
    ),
    // alUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'alUSD',
          coingeckoId: 'alchemix-usd',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
            },
          },
        },
      ]
    ),
    // BUSD - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [DefaultTokenList.BUSD]
    ),
    // MIM - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [DefaultTokenList.MIM]
    ),
    // RAI - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x618788357D0EBd8A37e763ADab3bc575D54c2C7d',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'RAI',
          coingeckoId: 'rai',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
            },
          },
        },
      ]
    ),
    // EURT - 3Pool
    getCurvePoolConfig(
      'ethereum',
      '0x9838eCcC42659FA8AA7daF2aD134b53984c9427b',
      GenesisBlocks['ethereum'],
      'wrap3Pool',
      [
        {
          symbol: 'EURT',
          coingeckoId: 'tether-eurt',
          chains: {
            ethereum: {
              decimals: 6,
              address: '0xC581b735A1688071A1746c968e0798D642EDE491',
            },
          },
        },
      ]
    ),
    // tBTC - 2BTC
    getCurvePoolConfig(
      'ethereum',
      '0xC25099792E9349C7DD09759744ea681C7de2cb66',
      GenesisBlocks['ethereum'],
      'wrap2Btc',
      [
        {
          symbol: 'tBTC',
          coingeckoId: 'tbtc',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x8daebade922df735c38c80c7ebd708af50815faa',
            },
          },
        },
      ]
    ),
    // pBTC - 2BTC
    getCurvePoolConfig(
      'ethereum',
      '0x7F55DDe206dbAD629C080068923b36fe9D6bDBeF',
      GenesisBlocks['ethereum'],
      'wrap2Btc',
      [
        {
          symbol: 'pBTC',
          coingeckoId: 'ptokens-btc-2',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x62199b909fb8b8cf870f97bef2ce6783493c4908',
            },
          },
        },
      ]
    ),
    // BBTC - 2BTC
    getCurvePoolConfig(
      'ethereum',
      '0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b',
      GenesisBlocks['ethereum'],
      'wrap2Btc',
      [
        {
          symbol: 'BBTC',
          coingeckoId: 'binance-wrapped-btc',
          chains: {
            ethereum: {
              decimals: 8,
              address: '0x9be89d2a4cd102d8fecc6bf9da793be995c22541',
            },
          },
        },
      ]
    ),
    // oBTC - 2BTC
    getCurvePoolConfig(
      'ethereum',
      '0xd81dA8D904b52208541Bade1bD6595D8a251F8dd',
      GenesisBlocks['ethereum'],
      'wrap2Btc',
      [
        {
          symbol: 'oBTC',
          coingeckoId: 'boringdao-btc',
          chains: {
            ethereum: {
              decimals: 18,
              address: '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68',
            },
          },
        },
      ]
    ),
    // Aave aDAI - asUSD
    getCurvePoolConfig('ethereum', '0xEB16Ae0052ed37f479f7fe63849198Df1765a733', GenesisBlocks['ethereum'], 'aave', [
      DefaultTokenList.DAI,
      {
        symbol: 'sUSD',
        coingeckoId: 'nusd',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
          },
        },
      },
    ]),
  ],
};
