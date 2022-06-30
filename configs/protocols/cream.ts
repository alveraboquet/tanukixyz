import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig } from '../types';

export const CreamConfigs: CompoundProtocolConfig = {
  name: 'cream',
  tokenomics: DefaultTokenList.CREAM,
  pools: [
    // polygon
    getCompoundPoolConfig(
      'polygon',
      '0x3fae5e5722c51cdb5b0afd8c7082e8a6af336ee8',
      GenesisBlocks['polygon'],
      DefaultTokenList.MATIC
    ), // MATIC
    getCompoundPoolConfig(
      'polygon',
      '0x73CF8c5D14Aa0EbC89f18272A568319F5BAB6cBD',
      GenesisBlocks['polygon'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'polygon',
      '0xf976C9bc0E16B250E0B1523CffAa9E4c07Bc5C8a',
      GenesisBlocks['polygon'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'polygon',
      '0x4eCEDdF62277eD78623f9A94995c680f8fd6C00e',
      GenesisBlocks['polygon'],
      DefaultTokenList.DAI
    ), // DAI
    getCompoundPoolConfig(
      'polygon',
      '0x7ef18d0a9C3Fb1A716FF6c3ED0Edf52a2427F716',
      GenesisBlocks['polygon'],
      DefaultTokenList.ETH
    ), // WETH
    getCompoundPoolConfig(
      'polygon',
      '0x5Dc3A30d8c5937f1529C3c93507C16d86A17072A',
      GenesisBlocks['polygon'],
      DefaultTokenList.WBTC
    ), // WBTC
    getCompoundPoolConfig(
      'polygon',
      '0x20d5d319C2964ecb52e1B006a4C059b7f6d6ad0a',
      GenesisBlocks['polygon'],
      DefaultTokenList.LINK
    ), // LINK
    getCompoundPoolConfig(
      'polygon',
      '0x468a7BF78f11Da82c90b17a93adb7B14999aF5AB',
      GenesisBlocks['polygon'],
      DefaultTokenList.SUSHI
    ), // SUSHI
    getCompoundPoolConfig(
      'polygon',
      '0xE82225bA6BeD28406912522F01C7102DD9f07e78',
      GenesisBlocks['polygon'],
      DefaultTokenList.CRV
    ), // CRV
    getCompoundPoolConfig(
      'polygon',
      '0x2eE80614Ccbc5e28654324a66A396458Fa5cD7Cc',
      GenesisBlocks['polygon'],
      DefaultTokenList.QUICK
    ), // QUICK
    getCompoundPoolConfig(
      'polygon',
      '0x4486835e0c567a320c0636d8f6e6e6679a46a271',
      GenesisBlocks['polygon'],
      DefaultTokenList.AAVE
    ), // AAVE
    getCompoundPoolConfig(
      'polygon',
      '0xfBbfa5fd64246046e683c423aa2AB0470fbD328D',
      GenesisBlocks['polygon'],
      DefaultTokenList.DPI
    ), // DPI
    getCompoundPoolConfig(
      'polygon',
      '0x9B21EB2E30D8320c3c1b8d8465284D78E58cB971',
      GenesisBlocks['polygon'],
      DefaultTokenList.FXS
    ), // FXS
    getCompoundPoolConfig(
      'polygon',
      '0xd4409B8D17d5d49a7ed9Ae734B0E8EdBa29b9FFA',
      GenesisBlocks['polygon'],
      DefaultTokenList.SNX
    ), // SNX
    getCompoundPoolConfig(
      'polygon',
      '0x7ea7174dD0CB4Ab84f42177F01e9a8a79475d381',
      GenesisBlocks['polygon'],
      DefaultTokenList.UNI
    ), // UNI
    getCompoundPoolConfig(
      'polygon',
      '0x98182BF525A4252C436ac349a4b79c7E6cd0EB7A',
      GenesisBlocks['polygon'],
      DefaultTokenList.BBTC
    ), // BBTC

    // bsc
    getCompoundPoolConfig(
      'binance',
      '0x1ffe17b99b439be0afc831239ddecda2a790ff3a',
      GenesisBlocks['binance'],
      DefaultTokenList.BNB
    ), // BNB
    getCompoundPoolConfig(
      'binance',
      '0x15cc701370cb8ada2a2b6f4226ec5cf6aa93bc67',
      GenesisBlocks['binance'],
      DefaultTokenList.BNB
    ), // WBNB
    getCompoundPoolConfig(
      'binance',
      '0x2bc4eb013ddee29d37920938b96d353171289b7c',
      GenesisBlocks['binance'],
      DefaultTokenList.BUSD
    ), // BUSD
    getCompoundPoolConfig(
      'binance',
      '0x11883Cdea6bAb720092791cc89affa54428Ce069',
      GenesisBlocks['binance'],
      DefaultTokenList.WBTC
    ), // BTCB
    getCompoundPoolConfig(
      'binance',
      '0xAa46e2c21B7763a73DB48e9b318899253E66e20C',
      GenesisBlocks['binance'],
      DefaultTokenList.XRP
    ), // XRP
    getCompoundPoolConfig(
      'binance',
      '0xCb87Cee8c77CdFD310fb3C58ff72e688d46f90b1',
      GenesisBlocks['binance'],
      DefaultTokenList.BCH
    ), // BCH
    getCompoundPoolConfig(
      'binance',
      '0xb31f5d117541825D6692c10e4357008EDF3E2BCD',
      GenesisBlocks['binance'],
      DefaultTokenList.ETH
    ), // ETH
    getCompoundPoolConfig(
      'binance',
      '0x8cc7E2a6de999758499658bB702143FD025E09B2',
      GenesisBlocks['binance'],
      DefaultTokenList.LTC
    ), // LTC
    getCompoundPoolConfig(
      'binance',
      '0xEF6d459FE81C3Ed53d292c936b2df5a8084975De',
      GenesisBlocks['binance'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'binance',
      '0x3942936782d788ce69155F776A51A5F1C9dd9B22',
      GenesisBlocks['binance'],
      DefaultTokenList.LINK
    ), // LINK
    getCompoundPoolConfig(
      'binance',
      '0x53D88d2ffDBE71E81D95b08AE0cA49D0C4A8515f',
      GenesisBlocks['binance'],
      DefaultTokenList.DOT
    ), // DOT
    getCompoundPoolConfig(
      'binance',
      '0x81c15d3e956e55e77e1f3f257f0a65bd2725fc55',
      GenesisBlocks['binance'],
      DefaultTokenList.ADA
    ), // ADA
    getCompoundPoolConfig(
      'binance',
      '0x426D6D53187be3288fe37f214e3F6901D8145b62',
      GenesisBlocks['binance'],
      DefaultTokenList.CREAM
    ), // CREAM
    getCompoundPoolConfig(
      'binance',
      '0x738f3810b3dA0F3e6dC8C689D0d72f3b4992c43b',
      GenesisBlocks['binance'],
      DefaultTokenList.BAND
    ), // BAND
    getCompoundPoolConfig(
      'binance',
      '0x19ee64850862cfd234e20c0db4eda286f12ec907',
      GenesisBlocks['binance'],
      DefaultTokenList.EOS
    ), // EOS
    getCompoundPoolConfig(
      'binance',
      '0x9095e8d707e40982affce41c61c10895157a1b22',
      GenesisBlocks['binance'],
      DefaultTokenList.DAI
    ), // DAI
    getCompoundPoolConfig(
      'binance',
      '0xe692714717a89e4f2ab89dd17d8dddd7bb52de8e',
      GenesisBlocks['binance'],
      DefaultTokenList.XTZ
    ), // XTZ
    getCompoundPoolConfig(
      'binance',
      '0x1af8c1c3ad36a041cb6678fed86b1e095004fd16',
      GenesisBlocks['binance'],
      DefaultTokenList.FIL
    ), // FIL
    getCompoundPoolConfig(
      'binance',
      '0xea466cd2583a0290b9e7b987a769a7eb468fb0a5',
      GenesisBlocks['binance'],
      DefaultTokenList.YFI
    ), // YFI
    getCompoundPoolConfig(
      'binance',
      '0x3b0be453a4008ebc2edd457e7bd355f1c5469d68',
      GenesisBlocks['binance'],
      DefaultTokenList.UNI
    ), // UNI
    getCompoundPoolConfig(
      'binance',
      '0x0e9d900c884964dc4b26db96ba113825b1a09baa',
      GenesisBlocks['binance'],
      DefaultTokenList.ATOM
    ), // ATOM
    getCompoundPoolConfig(
      'binance',
      '0xd83c88db3a6ca4a32fff1603b0f7ddce01f5f727',
      GenesisBlocks['binance'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'binance',
      '0x264bc4ea2f45cf6331ad6c3ac8d7257cf487fcbc',
      GenesisBlocks['binance'],
      DefaultTokenList.ALPHA
    ), // ALPHA
    getCompoundPoolConfig(
      'binance',
      '0x2d3bfaDF9BC94E3Ab796029A030e863F1898aA06',
      GenesisBlocks['binance'],
      DefaultTokenList.TWT
    ), // TWT
    getCompoundPoolConfig(
      'binance',
      '0xbf9b95b78bc42f6cf53ff2a0ce19d607cfe1ff82',
      GenesisBlocks['binance'],
      DefaultTokenList.CAKE
    ), // CAKE
    getCompoundPoolConfig(
      'binance',
      '0x4ebdef163ff08ac1d56a89bafefd6c01cc28a48f',
      GenesisBlocks['binance'],
      DefaultTokenList.XVS
    ), // XVS
    getCompoundPoolConfig(
      'binance',
      '0x4cb7f1f4ad7a6b53802589af3b90612c1674fec4',
      GenesisBlocks['binance'],
      DefaultTokenList.BAT
    ), // BAT
    getCompoundPoolConfig(
      'binance',
      '0x84902bd5ccef97648bf69c5096729a9367043beb',
      GenesisBlocks['binance'],
      DefaultTokenList.VAI
    ), // VAI
    getCompoundPoolConfig(
      'binance',
      '0xf77df34f4bf632fb5ca928592a73a29a42bcf0b1',
      GenesisBlocks['binance'],
      DefaultTokenList.AUTO
    ), // AUTO
    getCompoundPoolConfig(
      'binance',
      '0x7f746a80506a4cafa39938f7c08ad59cfa6de418',
      GenesisBlocks['binance'],
      DefaultTokenList.renBTC
    ), // renBTC
    getCompoundPoolConfig(
      'binance',
      '0xc17c8c5b8bb9456c624f8534fde6cbda2451488c',
      GenesisBlocks['binance'],
      DefaultTokenList.IOTX
    ), // IOTX
    getCompoundPoolConfig(
      'binance',
      '0xa8d75a0d17d2f4f2f4673975ab8470269d019c96',
      GenesisBlocks['binance'],
      DefaultTokenList.SXP
    ), // SXP
    getCompoundPoolConfig(
      'binance',
      '0x9b53e7d5e3f6cc8694840ed6c9f7fee79e7bcee5',
      GenesisBlocks['binance'],
      DefaultTokenList.SUSHI
    ), // SUSHI
  ],
};
