import { getChainConfig } from '../../core/constants/chains';
import { CompoundEthPools } from './constants/compoundEthPools';
import { LendingConfig } from './types';
import {IronBankEthPools} from "./constants/ironbankEthPools";
import {IronBankFtmPools} from "./constants/ironbankFtmPools";
import {IronBankAvaxPools} from "./constants/ironbankAvaxPools";
import {VenusBscPools} from "./constants/venusBscPools";
import {TraderJoeAvaxPools} from "./constants/traderjoeAvaxPools";
import {BenqiAvaxPools} from "./constants/benqiAvaxPools";
import {AurigamiAuroraPools} from "./constants/aurigamiAuroraPools";
import {BastionAuroraPools} from "./constants/bastionAuroraPools";
import {ScreamFtmPools} from "./constants/screamFtmPools";

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
};
