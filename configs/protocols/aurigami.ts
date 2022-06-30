import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig } from '../types';

export const AurigamiConfigs: CompoundProtocolConfig = {
  name: 'aurigami',
  tokenomics: DefaultTokenList.PLY,
  pools: [
    getCompoundPoolConfig(
      'aurora',
      '0xca9511B610bA5fc7E311FDeF9cE16050eE4449E9',
      GenesisBlocks['aurora'],
      DefaultTokenList.ETH
    ), // ETH
    getCompoundPoolConfig(
      'aurora',
      '0x4f0d864b1ABf4B701799a0b30b57A22dFEB5917b',
      GenesisBlocks['aurora'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'aurora',
      '0xCFb6b0498cb7555e7e21502E0F449bf28760Adbb',
      GenesisBlocks['aurora'],
      DefaultTokenList.WBTC
    ), // WBTC
    getCompoundPoolConfig(
      'aurora',
      '0xaD5A2437Ff55ed7A8Cad3b797b3eC7c5a19B1c54',
      GenesisBlocks['aurora'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'aurora',
      '0xaE4fac24dCdAE0132C6d04f564dCf059616E9423',
      GenesisBlocks['aurora'],
      DefaultTokenList.NEAR
    ), // NEAR
    getCompoundPoolConfig(
      'aurora',
      '0x3195949f267702723bc614cAE037cdc8D1E94786',
      GenesisBlocks['aurora'],
      DefaultTokenList.stNEAR
    ), // stNEAR
    getCompoundPoolConfig(
      'aurora',
      '0x8888682E24dd4Df7B7Ff2B91fccB575737E433bf',
      GenesisBlocks['aurora'],
      DefaultTokenList.AURORA
    ), // AURORA
    getCompoundPoolConfig(
      'aurora',
      '0x6Ea6C03061bDdCE23d4Ec60B6E6e880c33d24dca',
      GenesisBlocks['aurora'],
      DefaultTokenList.TRI
    ), // TRI
  ],
};
