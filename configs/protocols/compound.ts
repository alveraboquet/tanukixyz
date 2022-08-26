import Compound3PoolAbi from '../abi/compound/v3Pool.json';
import { getChainConfig } from '../chains';
import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig, EventIndexConfig, ProtocolConfig, TokenConfig } from '../types';

export const CompoundConfigs: CompoundProtocolConfig = {
  name: 'compound',
  tokenomics: DefaultTokenList.COMP,
  subgraphs: [
    {
      chainConfig: getChainConfig('ethereum'),
      lending: 'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2',
    },
  ],
  pools: [
    getCompoundPoolConfig(
      'ethereum',
      '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c',
      GenesisBlocks['ethereum'],
      DefaultTokenList.AAVE
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
      GenesisBlocks['ethereum'],
      DefaultTokenList.BAT
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4',
      GenesisBlocks['ethereum'],
      DefaultTokenList.COMP
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
      GenesisBlocks['ethereum'],
      DefaultTokenList.DAI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
      GenesisBlocks['ethereum'],
      DefaultTokenList.ETH
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x7713dd9ca933848f6819f38b8352d9a15ea73f67',
      GenesisBlocks['ethereum'],
      DefaultTokenList.FEI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xface851a4921ce59e912d19329929ce6da6eb0c7',
      GenesisBlocks['ethereum'],
      DefaultTokenList.LINK
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b',
      GenesisBlocks['ethereum'],
      DefaultTokenList.MKR
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
      GenesisBlocks['ethereum'],
      DefaultTokenList.REP
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xf5dce57282a584d2746faf1593d3121fcac444dc',
      GenesisBlocks['ethereum'],
      DefaultTokenList.SAI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7',
      GenesisBlocks['ethereum'],
      DefaultTokenList.SUSHI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x12392f67bdf24fae0af363c24ac620a2f67dad86',
      GenesisBlocks['ethereum'],
      DefaultTokenList.TUSD
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x35a18000230da775cac24873d00ff85bccded550',
      GenesisBlocks['ethereum'],
      DefaultTokenList.UNI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x39aa39c021dfbae8fac545936693ac917d5e7563',
      GenesisBlocks['ethereum'],
      DefaultTokenList.USDC
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x041171993284df560249b57358f931d9eb7b925d',
      GenesisBlocks['ethereum'],
      DefaultTokenList.USDP
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      GenesisBlocks['ethereum'],
      DefaultTokenList.USDT
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
      GenesisBlocks['ethereum'],
      DefaultTokenList.WBTC
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xccf4429db6322d5c611ee964527d42e5d685dd6a',
      GenesisBlocks['ethereum'],
      DefaultTokenList.WBTC
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946',
      GenesisBlocks['ethereum'],
      DefaultTokenList.YFI
    ),
    getCompoundPoolConfig(
      'ethereum',
      '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
      GenesisBlocks['ethereum'],
      DefaultTokenList.ZRX
    ),
  ],
};

export interface Compound3PoolConfig extends EventIndexConfig {
  underlying: TokenConfig;
}

export interface Compound3ProtocolConfig extends ProtocolConfig {
  pools: Array<Compound3PoolConfig>;
}

export const Compound3Configs: Compound3ProtocolConfig = {
  name: 'compound3',
  tokenomics: DefaultTokenList.COMP,
  pools: [
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: Compound3PoolAbi,
      contractAddress: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
      contractBirthday: 15331586,
      underlying: DefaultTokenList.USDC,
      events: ['Supply', 'Withdraw', 'SupplyCollateral', 'WithdrawCollateral', 'AbsorbDebt', 'AbsorbCollateral'],
    },
  ],
};
