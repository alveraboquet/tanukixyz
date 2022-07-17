import cTokenAbi from '../abi/compound/cToken.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig } from '../types';

export const IronBankConfigs: CompoundProtocolConfig = {
  name: 'ironbank',
  tokenomics: DefaultTokenList.IB,
  pools: [
    // ethereum
    getCompoundPoolConfig(
      'ethereum',
      '0x226f3738238932ba0db2319a8117d9555446102f',
      GenesisBlocks['ethereum'],
      DefaultTokenList.SUSHI
    ), // SUSHI
    getCompoundPoolConfig(
      'ethereum',
      '0x48759f220ed983db51fa7a8c0d2aab8f3ce4166a',
      GenesisBlocks['ethereum'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'ethereum',
      '0x8e595470ed749b85c6f7669de83eae304c2ec68f',
      GenesisBlocks['ethereum'],
      DefaultTokenList.DAI
    ), // DAI
    getCompoundPoolConfig(
      'ethereum',
      '0x76eb2fe28b36b3ee97f3adae0c69606eedb2a37c',
      GenesisBlocks['ethereum'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'ethereum',
      '0x41c84c0e2ee0b740cf0d31f63f3b6f627dc6b393',
      GenesisBlocks['ethereum'],
      DefaultTokenList.ETH
    ), // WETH
    getCompoundPoolConfig(
      'ethereum',
      '0x7736ffb07104c0c400bb0cc9a7c228452a732992',
      GenesisBlocks['ethereum'],
      DefaultTokenList.DPI
    ), // DPI
    getCompoundPoolConfig(
      'ethereum',
      '0xb8c5af54bbdcc61453144cf472a9276ae36109f9',
      GenesisBlocks['ethereum'],
      DefaultTokenList.CRV
    ), // CRV
    getCompoundPoolConfig(
      'ethereum',
      '0x30190a3b52b5ab1daf70d46d72536f5171f22340',
      GenesisBlocks['ethereum'],
      DefaultTokenList.AAVE
    ), // AAVE
    getCompoundPoolConfig(
      'ethereum',
      '0x8fc8bfd80d6a9f17fb98a373023d72531792b431',
      GenesisBlocks['ethereum'],
      DefaultTokenList.WBTC
    ), // WBTC
    getCompoundPoolConfig(
      'ethereum',
      '0xfeeb92386a055e2ef7c2b598c872a4047a7db59f',
      GenesisBlocks['ethereum'],
      DefaultTokenList.UNI
    ), // UNI
    getCompoundPoolConfig(
      'ethereum',
      '0xe7bff2da8a2f619c2586fb83938fa56ce803aa16',
      GenesisBlocks['ethereum'],
      DefaultTokenList.LINK
    ), // LINK
    getCompoundPoolConfig(
      'ethereum',
      '0x12a9cc33a980daa74e00cc2d1a0e74c57a93d12c',
      GenesisBlocks['ethereum'],
      DefaultTokenList.SNX
    ), // SNX
    getCompoundPoolConfig(
      'ethereum',
      '0xfa3472f7319477c9bfecdd66e4b948569e7621b9',
      GenesisBlocks['ethereum'],
      DefaultTokenList.YFI
    ), // YFI
    getCompoundPoolConfig(
      'ethereum',
      '0xe0b57feed45e7d908f2d0dacd26f113cf26715bf',
      GenesisBlocks['ethereum'],
      DefaultTokenList.CVX
    ), // CVX
    getCompoundPoolConfig(
      'ethereum',
      '0xa8caea564811af0e92b1e044f3edd18fa9a73e4f',
      GenesisBlocks['ethereum'],
      DefaultTokenList.EURS
    ), // EURS
    getCompoundPoolConfig(
      'ethereum',
      '0x9d029cd7cedcb194e2c361948f279f1788135bb2',
      GenesisBlocks['ethereum'],
      DefaultTokenList.CREAM
    ), // CREAM
    getCompoundPoolConfig(
      'ethereum',
      '0x09bdcce2593f0bef0991188c25fb744897b6572d',
      GenesisBlocks['ethereum'],
      DefaultTokenList.BUSD
    ), // BUSD
    getCompoundPoolConfig(
      'ethereum',
      '0x9e8E207083ffd5BDc3D99A1F32D1e6250869C1A9',
      GenesisBlocks['ethereum'],
      DefaultTokenList.MIM
    ), // MIM
    getCompoundPoolConfig('ethereum', '0x00e5c0774A5F065c285068170b20393925C84BF3', GenesisBlocks['ethereum'], {
      symbol: 'ibEUR',
      coingeckoId: 'iron-bank-euro',
      chains: {
        ethereum: {
          decimals: 18,
          address: '',
        },
      },
    }), // ibEUR
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0x3c9f5385c288cE438Ed55620938A4B967c080101',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibKRW',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibKRW
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0x215F34af6557A6598DbdA9aa11cc556F5AE264B1',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibJPY',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibJPY
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0x86BBD9ac8B9B44C95FFc6BAAe58E25033B7548AA',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibAUD',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibAUD
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0xecaB2C76f1A8359A06fAB5fA0CEea51280A97eCF',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibGBP',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibGBP
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0x1b3E95E8ECF7A7caB6c4De1b344F94865aBD12d5',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibCHF',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibCHF
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: cTokenAbi,
      contractAddress: '0x672473908587b10e65DAB177Dbaeadcbb30BF40B',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Mint', 'Redeem', 'Borrow', 'RepayBorrow'],
      underlying: {
        symbol: 'ibZAR',
        coingeckoId: '',
        chains: {
          ethereum: {
            decimals: 18,
            address: '',
          },
        },
      },
      underlyingOracle: '0xe4e9f6cfe8ac8c75a3dbef809dbe4fc40e6fdc4b',
    }, // ibCHF

    // avalanche
    getCompoundPoolConfig(
      'avalanche',
      '0xb3c68d69E95B095ab4b33B4cB67dBc0fbF3Edf56',
      GenesisBlocks['avalanche'],
      DefaultTokenList.AVAX
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0x338EEE1F7B89CE6272f302bDC4b952C13b221f1d',
      GenesisBlocks['avalanche'],
      DefaultTokenList.ETH
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xCEb1cE674f38398432d20bc8f90345E91Ef46fd3',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDT
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xa124B7514217e06F88FFa833e37289E397C5cC6B',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDT
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xe28965073C49a02923882B8329D3E8C1D805E832',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDC
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xEc5Aa19566Aa442C8C50f3C6734b6Bb23fF21CD7',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDC
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0x085682716f61a72bf8C573FBaF88CCA68c60E99B',
      GenesisBlocks['avalanche'],
      DefaultTokenList.DAI
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xB09b75916C5F4097C8b5812E63e216FEF97661Fc',
      GenesisBlocks['avalanche'],
      DefaultTokenList.WBTC
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0x18931772Adb90e7f214B6CbC78DdD6E0F090D4B1',
      GenesisBlocks['avalanche'],
      DefaultTokenList.LINK
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0xbf1430d9eC170b7E97223C7F321782471C587b29',
      GenesisBlocks['avalanche'],
      DefaultTokenList.MIM
    ),
    getCompoundPoolConfig(
      'avalanche',
      '0x02C9133627a14214879175a7A222d0a7f7404eFb',
      GenesisBlocks['avalanche'],
      DefaultTokenList.ALPHA
    ),

    // fantom
    getCompoundPoolConfig(
      'fantom',
      '0xd528697008aC67A21818751A5e3c58C8daE54696',
      GenesisBlocks['fantom'],
      DefaultTokenList.FTM
    ), // WFTM
    getCompoundPoolConfig(
      'fantom',
      '0xcc3E89fBc10e155F1164f8c9Cf0703aCDe53f6Fd',
      GenesisBlocks['fantom'],
      DefaultTokenList.ETH
    ), // WETH
    getCompoundPoolConfig(
      'fantom',
      '0x20CA53E2395FA571798623F1cFBD11Fe2C114c24',
      GenesisBlocks['fantom'],
      DefaultTokenList.WBTC
    ), // WBTC
    getCompoundPoolConfig(
      'fantom',
      '0x04c762a5dF2Fa02FE868F25359E0C259fB811CfE',
      GenesisBlocks['fantom'],
      DefaultTokenList.DAI
    ), // DAI
    getCompoundPoolConfig(
      'fantom',
      '0x328A7b4d538A2b3942653a9983fdA3C12c571141',
      GenesisBlocks['fantom'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'fantom',
      '0x0980f2F0D2af35eF2c4521b2342D59db575303F7',
      GenesisBlocks['fantom'],
      DefaultTokenList.YFI
    ), // YFI
    getCompoundPoolConfig(
      'fantom',
      '0xB1FD648D8CA4bE22445963554b85AbbFC210BC83',
      GenesisBlocks['fantom'],
      DefaultTokenList.SUSHI
    ), // SUSHI
    getCompoundPoolConfig(
      'fantom',
      '0x79EA17bEE0a8dcb900737E8CAa247c8358A5dfa1',
      GenesisBlocks['fantom'],
      DefaultTokenList.AAVE
    ), // AAVE
    getCompoundPoolConfig(
      'fantom',
      '0x4eCEDdF62277eD78623f9A94995c680f8fd6C00e',
      GenesisBlocks['fantom'],
      DefaultTokenList.LINK
    ), // LINK
    getCompoundPoolConfig(
      'fantom',
      '0x1cc6Cf8455f7783980B1ee06ecD4ED9acd94e1c7',
      GenesisBlocks['fantom'],
      DefaultTokenList.SNX
    ), // SNX
    getCompoundPoolConfig(
      'fantom',
      '0x70faC71debfD67394D1278D98A29dea79DC6E57A',
      GenesisBlocks['fantom'],
      DefaultTokenList.USDT
    ), // fUSDT
    getCompoundPoolConfig(
      'fantom',
      '0x46F298D5bB6389ccb6C1366bB0C8a30892CA2f7C',
      GenesisBlocks['fantom'],
      DefaultTokenList.MIM
    ), // MIM
    getCompoundPoolConfig(
      'fantom',
      '0x2919Ec3e7B35fB0C8597A5f806fb1f59c540EAb4',
      GenesisBlocks['fantom'],
      DefaultTokenList.FRAX
    ), // FRAX
    getCompoundPoolConfig(
      'fantom',
      '0x28192abdB1D6079767aB3730051c7f9Ded06FE46',
      GenesisBlocks['fantom'],
      DefaultTokenList.TUSD
    ), // TUSD
  ],
};
