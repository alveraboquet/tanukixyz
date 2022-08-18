import RibbonVaultAbi from '../abi/ribbon/RibbonVault.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { EventIndexConfig, ProtocolConfig, TokenConfig } from '../types';

export interface RibbonVaultConfig extends EventIndexConfig {
  asset: TokenConfig;
}

export interface RibbonProtocolConfig extends ProtocolConfig {
  subgraphs: Array<{
    version: 1 | 2;
    endpoint: string;
  }>;
  vaults: Array<RibbonVaultConfig>;
}

export const RibbonConfigs: RibbonProtocolConfig = {
  name: 'ribbon',
  tokenomics: {
    symbol: 'RBN',
    coingeckoId: 'ribbon-finance',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  subgraphs: [
    {
      version: 1,
      endpoint: 'https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance',
    },
    {
      version: 2,
      endpoint: 'https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2',
    },
  ],
  vaults: [
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: RibbonVaultAbi,
      contractAddress: '0xe63151A0Ed4e5fafdc951D877102cf0977Abd365',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Withdraw'],
      asset: DefaultTokenList.AAVE,
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: RibbonVaultAbi,
      contractAddress: '0xCc323557c71C0D1D20a1861Dc69c06C5f3cC9624',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Withdraw'],
      asset: DefaultTokenList.USDC,
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: RibbonVaultAbi,
      contractAddress: '0x25751853Eab4D0eB3652B5eB6ecB102A2789644B',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Withdraw'],
      asset: DefaultTokenList.ETH,
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: RibbonVaultAbi,
      contractAddress: '0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Withdraw'],
      asset: DefaultTokenList.WBTC,
    },
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: RibbonVaultAbi,
      contractAddress: '0x53773E034d9784153471813dacAFF53dBBB78E8c',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Withdraw'],
      asset: {
        symbol: 'wstETH',
        coingeckoId: 'wrapped-steth',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
          },
        },
      },
    },
  ],
};
