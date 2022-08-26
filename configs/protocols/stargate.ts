import StargatePoolAbi from '../abi/stargate/Pool.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { EventIndexConfig, ProtocolConfig, TokenConfig } from '../types';

export interface StargatePool extends EventIndexConfig {
  token: TokenConfig;
}

export interface StargateProtocolConfig extends ProtocolConfig {
  pools: Array<StargatePool>;
}

export const StargateConfigs: StargateProtocolConfig = {
  name: 'stargate',
  tokenomics: {
    symbol: 'STG',
    coingeckoId: 'stargate-finance',
    chains: {},
  },
  pools: [
    // ethereum
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
      contractBirthday: 14403393,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
      contractBirthday: 14403393,
      token: DefaultTokenList.USDT,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x101816545F6bd2b1076434B54383a1E633390A2E',
      contractBirthday: 14403393,
      token: DefaultTokenList.ETH,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // binance
    {
      chainConfig: getChainConfig('binance'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x9aA83081AA06AF7208Dcc7A4cB72C94d057D2cda',
      contractBirthday: 16135132,
      token: DefaultTokenList.USDT,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('binance'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x98a5737749490856b401DB5Dc27F522fC314A4e1',
      contractBirthday: 16135132,
      token: DefaultTokenList.BUSD,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // avalanche
    {
      chainConfig: getChainConfig('avalanche'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x1205f31718499dBf1fCa446663B532Ef87481fe1',
      contractBirthday: 12219159,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('avalanche'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c',
      contractBirthday: 12219159,
      token: DefaultTokenList.USDT,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // polygon
    {
      chainConfig: getChainConfig('polygon'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x1205f31718499dBf1fCa446663B532Ef87481fe1',
      contractBirthday: 26032726,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('polygon'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c',
      contractBirthday: 26032726,
      token: DefaultTokenList.USDT,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // arbitrum
    {
      chainConfig: getChainConfig('arbitrum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x892785f33CdeE22A30AEF750F285E18c18040c3e',
      contractBirthday: 8041115,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('arbitrum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0xB6CfcF89a7B22988bfC96632aC2A9D6daB60d641',
      contractBirthday: 8041115,
      token: DefaultTokenList.USDT,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('arbitrum'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x915A55e36A01285A14f05dE6e81ED9cE89772f8e',
      contractBirthday: 8041115,
      token: DefaultTokenList.ETH,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // optimism
    {
      chainConfig: getChainConfig('optimism'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0xDecC0c09c3B5f6e92EF4184125D5648a66E35298',
      contractBirthday: 4535509,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
    {
      chainConfig: getChainConfig('optimism'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0xd22363e3762cA7339569F3d33EADe20127D5F98C',
      contractBirthday: 4535509,
      token: DefaultTokenList.ETH,
      events: ['Mint', 'Burn', 'Swap'],
    },

    // fantom
    {
      chainConfig: getChainConfig('fantom'),
      contractAbi: StargatePoolAbi,
      contractAddress: '0x12edeA9cd262006cC3C4E77c90d2CD2DD4b1eb97',
      contractBirthday: 33647195,
      token: DefaultTokenList.USDC,
      events: ['Mint', 'Burn', 'Swap'],
    },
  ],
};
