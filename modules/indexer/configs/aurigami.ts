import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const AuroraSyncFromBlock = 56403927; // Dec-31-2021 05:27:38 PM +UTC

const AurigamiConfigs: Array<IndexConfig> = [
  // aurora
  getCompoundPoolEtherIndexConfig('aurora', '0xca9511B610bA5fc7E311FDeF9cE16050eE4449E9', AuroraSyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('aurora', '0x4f0d864b1ABf4B701799a0b30b57A22dFEB5917b', AuroraSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('aurora', '0xCFb6b0498cb7555e7e21502E0F449bf28760Adbb', AuroraSyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('aurora', '0xaD5A2437Ff55ed7A8Cad3b797b3eC7c5a19B1c54', AuroraSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('aurora', '0xaE4fac24dCdAE0132C6d04f564dCf059616E9423', AuroraSyncFromBlock), // NEAR
  getCompoundPoolTokenIndexConfig('aurora', '0x3195949f267702723bc614cAE037cdc8D1E94786', AuroraSyncFromBlock), // stNEAR
  getCompoundPoolTokenIndexConfig('aurora', '0x8888682E24dd4Df7B7Ff2B91fccB575737E433bf', AuroraSyncFromBlock), // AURORA
  getCompoundPoolTokenIndexConfig('aurora', '0x6Ea6C03061bDdCE23d4Ec60B6E6e880c33d24dca', AuroraSyncFromBlock), // TRI
];

export default AurigamiConfigs;
