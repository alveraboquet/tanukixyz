import AaveV2LendingPoolAbi from '../../core/abi/aave/AaveV2LendingPool.json';
import AaveV3LendingPoolAbi from '../../core/abi/aave/AaveV3LendingPool.json';
import BorrowOperation from '../../core/abi/liquity/BorrowOperation.json';
import { getChainConfig } from '../../core/constants/chains';
import { AaveV2AvaxPools } from './constants/aavev2AvaxPools';
import { AaveV2EthPools } from './constants/aavev2EthPools';
import { AaveV2PolygonPools } from './constants/aavev2PolygonPools';
import { AaveV3AvaxPools } from './constants/aavev3AvaxPools';
import { AaveV3FtmPools } from './constants/aavev3FtmPools';
import { AurigamiAuroraPools } from './constants/aurigamiAuroraPools';
import { BastionAuroraPools } from './constants/bastionAuroraPools';
import { BenqiAvaxPools } from './constants/benqiAvaxPools';
import { CompoundEthPools } from './constants/compoundEthPools';
import { IronBankAvaxPools } from './constants/ironbankAvaxPools';
import { IronBankEthPools } from './constants/ironbankEthPools';
import { IronBankFtmPools } from './constants/ironbankFtmPools';
import { ScreamFtmPools } from './constants/screamFtmPools';
import { TraderJoeAvaxPools } from './constants/traderjoeAvaxPools';
import { VenusBscPools } from './constants/venusBscPools';
import { LendingConfig } from './types';

export const InitialDateData = 1609459200; // Fri Jan 01 2021 00:00:00 GMT+0000

export const LendingConfigs: { [key: string]: LendingConfig } = {
  compound: {
    name: 'compound',
    configs: [
      {
        chainConfig: getChainConfig('ethereum'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: CompoundEthPools,
      },
    ],
  },
  aave: {
    name: 'aave',
    configs: [
      {
        chainConfig: getChainConfig('ethereum'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: AaveV2EthPools,
        lendingPool: {
          abi: AaveV2LendingPoolAbi,
          genesisBlock: 11362579,
          address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
        },
      },
      {
        chainConfig: getChainConfig('avalanche'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: AaveV2AvaxPools,
        lendingPool: {
          abi: AaveV2LendingPoolAbi,
          genesisBlock: 4607005,
          address: '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C',
        },
      },
      {
        chainConfig: getChainConfig('polygon'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: AaveV2PolygonPools,
        lendingPool: {
          abi: AaveV2LendingPoolAbi,
          genesisBlock: 12687245,
          address: '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf',
        },
      },
      {
        chainConfig: getChainConfig('avalanche'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: AaveV3AvaxPools,
        lendingPool: {
          abi: AaveV3LendingPoolAbi,
          genesisBlock: 11970506,
          address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        },
      },
      {
        chainConfig: getChainConfig('fantom'),
        birthday: 1577836800, // Wed Jan 01 2020 00:00:00 GMT+0000
        pools: AaveV3FtmPools,
        lendingPool: {
          abi: AaveV3LendingPoolAbi,
          genesisBlock: 33142113,
          address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        },
      },
    ],
  },
  ironbank: {
    name: 'ironbank',
    configs: [
      {
        chainConfig: getChainConfig('ethereum'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: IronBankEthPools,
      },
      {
        chainConfig: getChainConfig('fantom'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: IronBankFtmPools,
      },
      {
        chainConfig: getChainConfig('avalanche'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: IronBankAvaxPools,
      },
    ],
  },
  venus: {
    name: 'venus',
    configs: [
      {
        chainConfig: getChainConfig('binance'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: VenusBscPools,
      },
    ],
  },
  traderjoe: {
    name: 'traderjoe',
    configs: [
      {
        chainConfig: getChainConfig('avalanche'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: TraderJoeAvaxPools,
      },
    ],
  },
  benqi: {
    name: 'benqi',
    configs: [
      {
        chainConfig: getChainConfig('avalanche'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: BenqiAvaxPools,
      },
    ],
  },
  scream: {
    name: 'scream',
    configs: [
      {
        chainConfig: getChainConfig('fantom'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: ScreamFtmPools,
      },
    ],
  },
  aurigami: {
    name: 'aurigami',
    configs: [
      {
        chainConfig: getChainConfig('aurora'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: AurigamiAuroraPools,
      },
    ],
  },
  bastion: {
    name: 'bastion',
    configs: [
      {
        chainConfig: getChainConfig('aurora'),
        birthday: 1609459200, // Fri Jan 01 2021 00:00:00 GMT+0000
        pools: BastionAuroraPools,
      },
    ],
  },
  liquity: {
    name: 'liquity',
    configs: [
      {
        chainConfig: getChainConfig('ethereum'),
        birthday: 1617580800, // Mon Apr 05 2021 00:00:00 GMT+0000
        pools: [
          {
            abi: BorrowOperation,
            poolAddress: '0x24179CD81c9e782A4096035f7eC97fB8B783e007',
            genesisBlock: 12178582,
            underlyingSymbol: 'ETH',
            underlyingDecimals: 18,
            underlyingCoingeckoId: 'ethereum',
          },
        ],
      },
    ],
  },
};
