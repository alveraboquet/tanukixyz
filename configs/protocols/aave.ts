import AaveV1Abi from '../abi/aave/AaveV1LendingPool.json';
import AaveV2Abi from '../abi/aave/AaveV2LendingPool.json';
import AaveV3Abi from '../abi/aave/AaveV3LendingPool.json';
import { getChainConfig } from '../chains';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { AaveProtocolConfig } from '../types';

export const AaveConfigs: AaveProtocolConfig = {
  name: 'aave',
  pools: [
    // v1 - ethereum
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: AaveV1Abi,
      contractAddress: '0x398eC7346DcD622eDc5ae82352F02bE94C62d119',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Borrow', 'RedeemUnderlying', 'Repay'],
    },

    // v2
    {
      chainConfig: getChainConfig('ethereum'),
      contractAbi: AaveV2Abi,
      contractAddress: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
      contractBirthday: GenesisBlocks['ethereum'],
      events: ['Deposit', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('polygon'),
      contractAbi: AaveV2Abi,
      contractAddress: '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf',
      contractBirthday: GenesisBlocks['polygon'],
      events: ['Deposit', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('avalanche'),
      contractAbi: AaveV2Abi,
      contractAddress: '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C',
      contractBirthday: GenesisBlocks['avalanche'],
      events: ['Deposit', 'Borrow', 'Withdraw', 'Repay'],
    },

    // v3
    {
      chainConfig: getChainConfig('avalanche'),
      contractAbi: AaveV3Abi,
      contractAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      contractBirthday: GenesisBlocks['avalanche'],
      events: ['Supply', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('fantom'),
      contractAbi: AaveV3Abi,
      contractAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      contractBirthday: GenesisBlocks['fantom'],
      events: ['Supply', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('polygon'),
      contractAbi: AaveV3Abi,
      contractAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      contractBirthday: GenesisBlocks['polygon'],
      events: ['Supply', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('harmony'),
      contractAbi: AaveV3Abi,
      contractAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      contractBirthday: GenesisBlocks['harmony'],
      events: ['Supply', 'Borrow', 'Withdraw', 'Repay'],
    },
    {
      chainConfig: getChainConfig('arbitrum'),
      contractAbi: AaveV3Abi,
      contractAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      contractBirthday: GenesisBlocks['arbitrum'],
      events: ['Supply', 'Borrow', 'Withdraw', 'Repay'],
    },
  ],
};
