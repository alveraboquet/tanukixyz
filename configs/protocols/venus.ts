import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig } from '../types';

export const VenusConfigs: CompoundProtocolConfig = {
  name: 'venus',
  pools: [
    getCompoundPoolConfig(
      'binance',
      '0xA07c5b74C9B40447a954e1466938b865b6BBea36',
      GenesisBlocks['binance'],
      DefaultTokenList.BNB
    ), // BNB
    getCompoundPoolConfig(
      'binance',
      '0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8',
      GenesisBlocks['binance'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'binance',
      '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
      GenesisBlocks['binance'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'binance',
      '0x95c78222B3D6e262426483D42CfA53685A67Ab9D',
      GenesisBlocks['binance'],
      DefaultTokenList.BUSD
    ), // BUSD
    getCompoundPoolConfig(
      'binance',
      '0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0',
      GenesisBlocks['binance'],
      DefaultTokenList.SXP
    ), // SXP
    getCompoundPoolConfig(
      'binance',
      '0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D',
      GenesisBlocks['binance'],
      DefaultTokenList.XVS
    ), // XVS
    getCompoundPoolConfig(
      'binance',
      '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B',
      GenesisBlocks['binance'],
      DefaultTokenList.WBTC
    ), // BTCB
    getCompoundPoolConfig(
      'binance',
      '0xf508fCD89b8bd15579dc79A6827cB4686A3592c8',
      GenesisBlocks['binance'],
      DefaultTokenList.ETH
    ), // ETH
    getCompoundPoolConfig(
      'binance',
      '0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B',
      GenesisBlocks['binance'],
      DefaultTokenList.LTC
    ), // LTC
    getCompoundPoolConfig(
      'binance',
      '0xB248a295732e0225acd3337607cc01068e3b9c10',
      GenesisBlocks['binance'],
      DefaultTokenList.XRP
    ), // XRP
    getCompoundPoolConfig(
      'binance',
      '0x1610bc33319e9398de5f57b33a5b184c806ad217',
      GenesisBlocks['binance'],
      DefaultTokenList.DOT
    ), // DOT
    getCompoundPoolConfig(
      'binance',
      '0x08ceb3f4a7ed3500ca0982bcd0fc7816688084c3',
      GenesisBlocks['binance'],
      DefaultTokenList.TUSD
    ), // TUSD
    getCompoundPoolConfig(
      'binance',
      '0x86ac3974e2bd0d60825230fa6f355ff11409df5c',
      GenesisBlocks['binance'],
      DefaultTokenList.CAKE
    ), // CAKE
    getCompoundPoolConfig(
      'binance',
      '0x5c9476fcd6a4f9a3654139721c949c2233bbbbc8',
      GenesisBlocks['binance'],
      DefaultTokenList.MATIC
    ), // MATIC
    getCompoundPoolConfig(
      'binance',
      '0x61edcfe8dd6ba3c891cb9bec2dc7657b3b422e93',
      GenesisBlocks['binance'],
      DefaultTokenList.TRX
    ), // TRX
    getCompoundPoolConfig(
      'binance',
      '0xec3422ef92b2fb59e84c8b02ba73f1fe84ed8d71',
      GenesisBlocks['binance'],
      DefaultTokenList.DOGE
    ), // DOGE
    getCompoundPoolConfig(
      'binance',
      '0x5f0388ebc2b94fa8e123f404b79ccf5f40b29176',
      GenesisBlocks['binance'],
      DefaultTokenList.BCH
    ), // BCH
    getCompoundPoolConfig(
      'binance',
      '0x26da28954763b92139ed49283625cecaf52c6f94',
      GenesisBlocks['binance'],
      DefaultTokenList.AAVE
    ), // AAVE
  ],
};
