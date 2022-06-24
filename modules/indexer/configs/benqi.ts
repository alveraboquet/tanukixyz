import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const AvaxSyncFromBlock = 8909901; // Dec-30-2021 12:13:54 PM +UTC

const BenqiConfigs: Array<IndexConfig> = [
  // avalanche
  getCompoundPoolEtherIndexConfig('avalanche', '0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c', AvaxSyncFromBlock), // AVAX
  getCompoundPoolTokenIndexConfig('avalanche', '0xF362feA9659cf036792c9cb02f8ff8198E21B4cB', AvaxSyncFromBlock), // sAVAX
  getCompoundPoolTokenIndexConfig('avalanche', '0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568', AvaxSyncFromBlock), // BTC
  getCompoundPoolTokenIndexConfig('avalanche', '0x334AD834Cd4481BB02d09615E7c11a00579A7909', AvaxSyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('avalanche', '0x4e9f683A27a6BdAD3FC2764003759277e93696e6', AvaxSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('avalanche', '0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C', AvaxSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('avalanche', '0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F', AvaxSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('avalanche', '0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF', AvaxSyncFromBlock), // USDTn
  getCompoundPoolTokenIndexConfig('avalanche', '0xB715808a78F6041E46d61Cb123C9B4A27056AE9C', AvaxSyncFromBlock), // USDCn
  getCompoundPoolTokenIndexConfig('avalanche', '0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D', AvaxSyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('avalanche', '0x35Bd6aedA81a7E5FC7A7832490e71F757b0cD9Ce', AvaxSyncFromBlock), // QI
];

export default BenqiConfigs;
