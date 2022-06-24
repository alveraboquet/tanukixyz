import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const BscSyncFromBlock = 13964677; // Dec-31-2021 07:50:48 PM +UTC

const VenusConfigs: Array<IndexConfig> = [
  // bsc
  getCompoundPoolEtherIndexConfig('binance', '0xA07c5b74C9B40447a954e1466938b865b6BBea36', BscSyncFromBlock), // BNB
  getCompoundPoolTokenIndexConfig('binance', '0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8', BscSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('binance', '0xfD5840Cd36d94D7229439859C0112a4185BC0255', BscSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('binance', '0x95c78222B3D6e262426483D42CfA53685A67Ab9D', BscSyncFromBlock), // BUSD
  getCompoundPoolTokenIndexConfig('binance', '0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0', BscSyncFromBlock), // SXP
  getCompoundPoolTokenIndexConfig('binance', '0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D', BscSyncFromBlock), // XVS
  getCompoundPoolTokenIndexConfig('binance', '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B', BscSyncFromBlock), // BTCB
  getCompoundPoolTokenIndexConfig('binance', '0xf508fCD89b8bd15579dc79A6827cB4686A3592c8', BscSyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('binance', '0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B', BscSyncFromBlock), // LTC
  getCompoundPoolTokenIndexConfig('binance', '0xB248a295732e0225acd3337607cc01068e3b9c10', BscSyncFromBlock), // XRP
  getCompoundPoolTokenIndexConfig('binance', '0x1610bc33319e9398de5f57b33a5b184c806ad217', BscSyncFromBlock), // DOT
  getCompoundPoolTokenIndexConfig('binance', '0x08ceb3f4a7ed3500ca0982bcd0fc7816688084c3', BscSyncFromBlock), // TUSD
  getCompoundPoolTokenIndexConfig('binance', '0x86ac3974e2bd0d60825230fa6f355ff11409df5c', BscSyncFromBlock), // CAKE
  getCompoundPoolTokenIndexConfig('binance', '0x78366446547d062f45b4c0f320cdaa6d710d87bb', BscSyncFromBlock), // UST
  getCompoundPoolTokenIndexConfig('binance', '0x5c9476fcd6a4f9a3654139721c949c2233bbbbc8', BscSyncFromBlock), // MATIC
  getCompoundPoolTokenIndexConfig('binance', '0x61edcfe8dd6ba3c891cb9bec2dc7657b3b422e93', BscSyncFromBlock), // TRX
  getCompoundPoolTokenIndexConfig('binance', '0xec3422ef92b2fb59e84c8b02ba73f1fe84ed8d71', BscSyncFromBlock), // DOGE
  getCompoundPoolTokenIndexConfig('binance', '0x5f0388ebc2b94fa8e123f404b79ccf5f40b29176', BscSyncFromBlock), // BCH
  getCompoundPoolTokenIndexConfig('binance', '0x26da28954763b92139ed49283625cecaf52c6f94', BscSyncFromBlock), // AAVE
  getCompoundPoolTokenIndexConfig('binance', '0xb91a659e88b51474767cd97ef3196a3e7cedd2c8', BscSyncFromBlock), // LUNA
];

export default VenusConfigs;
