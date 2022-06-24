import { getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const AvaxSyncFromBlock = 8909901; // Dec-30-2021 12:13:54 PM +UTC

const TraderJoeConfigs: Array<IndexConfig> = [
  // avalanche
  getCompoundPoolTokenIndexConfig('avalanche', '0xc22f01ddc8010ee05574028528614634684ec29e', AvaxSyncFromBlock), // WAVAX
  getCompoundPoolTokenIndexConfig('avalanche', '0x929f5cab61dfec79a5431a7734a68d714c4633fa', AvaxSyncFromBlock), // WETH.e
  getCompoundPoolTokenIndexConfig('avalanche', '0x3fe38b7b610c0acd10296fef69d9b18eb7a9eb1f', AvaxSyncFromBlock), // WBTC.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xed6aaf91a2b084bd594dbd1245be3691f9f637ac', AvaxSyncFromBlock), // USDC.e
  getCompoundPoolTokenIndexConfig('avalanche', '0x29472d511808ce925f501d25f9ee9effd2328db2', AvaxSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('avalanche', '0x8b650e26404ac6837539ca96812f0123601e4448', AvaxSyncFromBlock), // USDT.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xc988c170d0e38197dc634a45bf00169c7aa7ca19', AvaxSyncFromBlock), // DAI.e
  getCompoundPoolTokenIndexConfig('avalanche', '0x585e7bc75089ed111b656faa7aeb1104f5b96c15', AvaxSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('avalanche', '0xce095a9657a02025081e0607c8d8b081c76a75ea', AvaxSyncFromBlock), // MIM
];

export default TraderJoeConfigs;
