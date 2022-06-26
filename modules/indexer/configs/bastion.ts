import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const AuroraSyncFromBlock = 56403927; // Dec-31-2021 05:27:38 PM +UTC

const BastionConfigs: Array<IndexConfig> = [
  // aurora
  getCompoundPoolEtherIndexConfig('aurora', '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0', AuroraSyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('aurora', '0xfa786baC375D8806185555149235AcDb182C033b', AuroraSyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('aurora', '0x8C14ea853321028a7bb5E4FB0d0147F183d3B677', AuroraSyncFromBlock), // NEAR
  getCompoundPoolTokenIndexConfig('aurora', '0xe5308dc623101508952948b141fD9eaBd3337D99', AuroraSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('aurora', '0x845E15A441CFC1871B7AC610b0E922019BaD9826', AuroraSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('aurora', '0x08Ac1236ae3982EC9463EfE10F0F320d9F5A9A4b', AuroraSyncFromBlock), // BSTN
];

export default BastionConfigs;
