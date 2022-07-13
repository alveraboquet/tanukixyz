import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundLendingPoolConfig, ProtocolConfig, TokenConfig } from '../types';

export interface AlpacaProtocolConfig extends ProtocolConfig {
  lendingPools: Array<CompoundLendingPoolConfig>;
}

const ALPACA_TOKEN: TokenConfig = {
  symbol: 'ALPACA',
  coingeckoId: 'alpaca-finance',
  chains: {
    binance: {
      decimals: 18,
      address: '',
    },
  },
};

export const AlpacaConfigs: AlpacaProtocolConfig = {
  name: 'alpaca',
  tokenomics: ALPACA_TOKEN,
  lendingPools: [
    getCompoundPoolConfig(
      'binance',
      '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
      GenesisBlocks['binance'],
      DefaultTokenList.BNB
    ),
    getCompoundPoolConfig(
      'binance',
      '0x7C9e73d4C71dae564d41F78d56439bB4ba87592f',
      GenesisBlocks['binance'],
      DefaultTokenList.BUSD
    ),
    getCompoundPoolConfig(
      'binance',
      '0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE',
      GenesisBlocks['binance'],
      DefaultTokenList.ETH
    ),
    getCompoundPoolConfig(
      'binance',
      '0xf1bE8ecC990cBcb90e166b71E368299f0116d421',
      GenesisBlocks['binance'],
      ALPACA_TOKEN
    ),
    getCompoundPoolConfig(
      'binance',
      '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
      GenesisBlocks['binance'],
      DefaultTokenList.USDT
    ),
    getCompoundPoolConfig(
      'binance',
      '0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7',
      GenesisBlocks['binance'],
      DefaultTokenList.WBTC
    ),
    getCompoundPoolConfig(
      'binance',
      '0x3282d2a151ca00BfE7ed17Aa16E42880248CD3Cd',
      GenesisBlocks['binance'],
      DefaultTokenList.TUSD
    ),
    getCompoundPoolConfig(
      'binance',
      '0x800933D685E7Dc753758cEb77C8bd34aBF1E26d7',
      GenesisBlocks['binance'],
      DefaultTokenList.USDC
    ),
    getCompoundPoolConfig(
      'binance',
      '0xfF693450dDa65df7DD6F45B4472655A986b147Eb',
      GenesisBlocks['binance'],
      DefaultTokenList.CAKE
    ),
  ],
};
