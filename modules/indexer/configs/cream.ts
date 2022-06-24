import { getCompoundPoolEtherIndexConfig, getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const BscSyncFromBlock = 13964677; // Dec-31-2021 07:50:48 PM +UTC
const PolygonSyncFromBlock = 22928824; // Dec-25-2021 02:29:39 AM +UTC
// const ArbitrumSyncFromBlock = 4143728; // Dec-28-2021 10:01:33 PM +UTC

const CreamConfigs: Array<IndexConfig> = [
  // arbitrum
  // getCompoundPoolEtherIndexConfig('arbitrum', '0x5441090C0401EE256b09DEb35679Ad175d1a0c97', ArbitrumSyncFromBlock), // ETH
  // getCompoundPoolTokenIndexConfig('arbitrum', '0xd5794ea7b269dB3a0CCB396774Cc2D0936FFBD86', ArbitrumSyncFromBlock), // USDC
  // getCompoundPoolTokenIndexConfig('arbitrum', '0x5eb35dAF9EF97E9e8cc33C486Bad884a62CAe9Ce', ArbitrumSyncFromBlock), // USDT

  // polygon
  getCompoundPoolEtherIndexConfig('polygon', '0x3fae5e5722c51cdb5b0afd8c7082e8a6af336ee8', PolygonSyncFromBlock), // MATIC
  getCompoundPoolTokenIndexConfig('polygon', '0x73CF8c5D14Aa0EbC89f18272A568319F5BAB6cBD', PolygonSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('polygon', '0xf976C9bc0E16B250E0B1523CffAa9E4c07Bc5C8a', PolygonSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('polygon', '0x4eCEDdF62277eD78623f9A94995c680f8fd6C00e', PolygonSyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('polygon', '0x7ef18d0a9C3Fb1A716FF6c3ED0Edf52a2427F716', PolygonSyncFromBlock), // WETH
  getCompoundPoolTokenIndexConfig('polygon', '0x5Dc3A30d8c5937f1529C3c93507C16d86A17072A', PolygonSyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('polygon', '0x20d5d319C2964ecb52e1B006a4C059b7f6d6ad0a', PolygonSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('polygon', '0x468a7BF78f11Da82c90b17a93adb7B14999aF5AB', PolygonSyncFromBlock), // SUSHI
  getCompoundPoolTokenIndexConfig('polygon', '0xE82225bA6BeD28406912522F01C7102DD9f07e78', PolygonSyncFromBlock), // CRV
  getCompoundPoolTokenIndexConfig('polygon', '0x2eE80614Ccbc5e28654324a66A396458Fa5cD7Cc', PolygonSyncFromBlock), // QUICK
  getCompoundPoolTokenIndexConfig('polygon', '0x4486835e0c567a320c0636d8f6e6e6679a46a271', PolygonSyncFromBlock), // AAVE
  getCompoundPoolTokenIndexConfig('polygon', '0xfBbfa5fd64246046e683c423aa2AB0470fbD328D', PolygonSyncFromBlock), // DPI
  getCompoundPoolTokenIndexConfig('polygon', '0x9B21EB2E30D8320c3c1b8d8465284D78E58cB971', PolygonSyncFromBlock), // FXS
  getCompoundPoolTokenIndexConfig('polygon', '0xd4409B8D17d5d49a7ed9Ae734B0E8EdBa29b9FFA', PolygonSyncFromBlock), // SNX
  getCompoundPoolTokenIndexConfig('polygon', '0x7ea7174dD0CB4Ab84f42177F01e9a8a79475d381', PolygonSyncFromBlock), // UNI
  getCompoundPoolTokenIndexConfig('polygon', '0x98182BF525A4252C436ac349a4b79c7E6cd0EB7A', PolygonSyncFromBlock), // BBTC

  // bsc
  getCompoundPoolEtherIndexConfig('binance', '0x1ffe17b99b439be0afc831239ddecda2a790ff3a', BscSyncFromBlock), // BNB
  getCompoundPoolTokenIndexConfig('binance', '0x15cc701370cb8ada2a2b6f4226ec5cf6aa93bc67', BscSyncFromBlock), // WBNB
  getCompoundPoolTokenIndexConfig('binance', '0x2bc4eb013ddee29d37920938b96d353171289b7c', BscSyncFromBlock), // BUSD
  getCompoundPoolTokenIndexConfig('binance', '0x11883Cdea6bAb720092791cc89affa54428Ce069', BscSyncFromBlock), // BTCB
  getCompoundPoolTokenIndexConfig('binance', '0xAa46e2c21B7763a73DB48e9b318899253E66e20C', BscSyncFromBlock), // XRP
  getCompoundPoolTokenIndexConfig('binance', '0xCb87Cee8c77CdFD310fb3C58ff72e688d46f90b1', BscSyncFromBlock), // BCH
  getCompoundPoolTokenIndexConfig('binance', '0xb31f5d117541825D6692c10e4357008EDF3E2BCD', BscSyncFromBlock), // ETH
  getCompoundPoolTokenIndexConfig('binance', '0x8cc7E2a6de999758499658bB702143FD025E09B2', BscSyncFromBlock), // LTC
  getCompoundPoolTokenIndexConfig('binance', '0xEF6d459FE81C3Ed53d292c936b2df5a8084975De', BscSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('binance', '0x3942936782d788ce69155F776A51A5F1C9dd9B22', BscSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('binance', '0x53D88d2ffDBE71E81D95b08AE0cA49D0C4A8515f', BscSyncFromBlock), // DOT
  getCompoundPoolTokenIndexConfig('binance', '0x81c15d3e956e55e77e1f3f257f0a65bd2725fc55', BscSyncFromBlock), // ADA
  getCompoundPoolTokenIndexConfig('binance', '0x426D6D53187be3288fe37f214e3F6901D8145b62', BscSyncFromBlock), // CREAM
  getCompoundPoolTokenIndexConfig('binance', '0x738f3810b3dA0F3e6dC8C689D0d72f3b4992c43b', BscSyncFromBlock), // BAND
  getCompoundPoolTokenIndexConfig('binance', '0x19ee64850862cfd234e20c0db4eda286f12ec907', BscSyncFromBlock), // EOS
  getCompoundPoolTokenIndexConfig('binance', '0x9095e8d707e40982affce41c61c10895157a1b22', BscSyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('binance', '0xe692714717a89e4f2ab89dd17d8dddd7bb52de8e', BscSyncFromBlock), // XTZ
  getCompoundPoolTokenIndexConfig('binance', '0x1af8c1c3ad36a041cb6678fed86b1e095004fd16', BscSyncFromBlock), // FIL
  getCompoundPoolTokenIndexConfig('binance', '0xea466cd2583a0290b9e7b987a769a7eb468fb0a5', BscSyncFromBlock), // YFI
  getCompoundPoolTokenIndexConfig('binance', '0x3b0be453a4008ebc2edd457e7bd355f1c5469d68', BscSyncFromBlock), // UNI
  getCompoundPoolTokenIndexConfig('binance', '0x0e9d900c884964dc4b26db96ba113825b1a09baa', BscSyncFromBlock), // ATOM
  getCompoundPoolTokenIndexConfig('binance', '0xd83c88db3a6ca4a32fff1603b0f7ddce01f5f727', BscSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('binance', '0x264bc4ea2f45cf6331ad6c3ac8d7257cf487fcbc', BscSyncFromBlock), // ALPHA
  getCompoundPoolTokenIndexConfig('binance', '0x2d3bfaDF9BC94E3Ab796029A030e863F1898aA06', BscSyncFromBlock), // TWT
  getCompoundPoolTokenIndexConfig('binance', '0xbf9b95b78bc42f6cf53ff2a0ce19d607cfe1ff82', BscSyncFromBlock), // CAKE
  getCompoundPoolTokenIndexConfig('binance', '0x4ebdef163ff08ac1d56a89bafefd6c01cc28a48f', BscSyncFromBlock), // XVS
  getCompoundPoolTokenIndexConfig('binance', '0x4cb7f1f4ad7a6b53802589af3b90612c1674fec4', BscSyncFromBlock), // BAT
  getCompoundPoolTokenIndexConfig('binance', '0x84902bd5ccef97648bf69c5096729a9367043beb', BscSyncFromBlock), // VAI
  getCompoundPoolTokenIndexConfig('binance', '0xf77df34f4bf632fb5ca928592a73a29a42bcf0b1', BscSyncFromBlock), // AUTO
  getCompoundPoolTokenIndexConfig('binance', '0x7f746a80506a4cafa39938f7c08ad59cfa6de418', BscSyncFromBlock), // renBTC
  getCompoundPoolTokenIndexConfig('binance', '0xdcf60e349a5aaeeecdd2fb6772931fbf3486ed1c', BscSyncFromBlock), // BETH
  getCompoundPoolTokenIndexConfig('binance', '0xc17c8c5b8bb9456c624f8534fde6cbda2451488c', BscSyncFromBlock), // IOTX
  getCompoundPoolTokenIndexConfig('binance', '0xa8d75a0d17d2f4f2f4673975ab8470269d019c96', BscSyncFromBlock), // SXP
  getCompoundPoolTokenIndexConfig('binance', '0x9b53e7d5e3f6cc8694840ed6c9f7fee79e7bcee5', BscSyncFromBlock), // SUSHI
];

export default CreamConfigs;
