import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const SyncFromBlock = 13910000; // Dec-31-2021 12:53:50 AM +UTC

const CompoundConfigs: Array<IndexConfig> = [
  getCompoundPoolEtherIndexConfig('ethereum', '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c', SyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('ethereum', '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5', SyncFromBlock), // AAVE
  getCompoundPoolTokenIndexConfig('ethereum', '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e', SyncFromBlock), // BAT
  getCompoundPoolTokenIndexConfig('ethereum', '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4', SyncFromBlock), // COMP
  getCompoundPoolTokenIndexConfig('ethereum', '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', SyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('ethereum', '0x7713dd9ca933848f6819f38b8352d9a15ea73f67', SyncFromBlock), // FEI
  getCompoundPoolTokenIndexConfig('ethereum', '0xface851a4921ce59e912d19329929ce6da6eb0c7', SyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('ethereum', '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b', SyncFromBlock), // MKR
  getCompoundPoolTokenIndexConfig('ethereum', '0x158079ee67fce2f58472a96584a73c7ab9ac95c1', SyncFromBlock), // REP
  getCompoundPoolTokenIndexConfig('ethereum', '0xf5dce57282a584d2746faf1593d3121fcac444dc', SyncFromBlock), // SAI
  getCompoundPoolTokenIndexConfig('ethereum', '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7', SyncFromBlock), // SUSHI
  getCompoundPoolTokenIndexConfig('ethereum', '0x12392f67bdf24fae0af363c24ac620a2f67dad86', SyncFromBlock), // TUSD
  getCompoundPoolTokenIndexConfig('ethereum', '0x35a18000230da775cac24873d00ff85bccded550', SyncFromBlock), // UNI
  getCompoundPoolTokenIndexConfig('ethereum', '0x39aa39c021dfbae8fac545936693ac917d5e7563', SyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('ethereum', '0x041171993284df560249b57358f931d9eb7b925d', SyncFromBlock), // USDP
  getCompoundPoolTokenIndexConfig('ethereum', '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', SyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('ethereum', '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4', SyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('ethereum', '0xccf4429db6322d5c611ee964527d42e5d685dd6a', SyncFromBlock), // WBTC2
  getCompoundPoolTokenIndexConfig('ethereum', '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946', SyncFromBlock), // YFI
  getCompoundPoolTokenIndexConfig('ethereum', '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407', SyncFromBlock), // ZRX
];

export default CompoundConfigs;
