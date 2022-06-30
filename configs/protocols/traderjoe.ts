import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig, UniswapProtocolConfig } from '../types';

export const TraderJoeLendingConfigs: CompoundProtocolConfig = {
  name: 'traderjoe',
  tokenomics: DefaultTokenList.JOE,
  pools: [
    getCompoundPoolConfig(
      'avalanche',
      '0xc22f01ddc8010ee05574028528614634684ec29e',
      GenesisBlocks['avalanche'],
      DefaultTokenList.AVAX
    ), // WAVAX
    getCompoundPoolConfig(
      'avalanche',
      '0x929f5cab61dfec79a5431a7734a68d714c4633fa',
      GenesisBlocks['avalanche'],
      DefaultTokenList.ETH
    ), // WETH.e
    getCompoundPoolConfig(
      'avalanche',
      '0x3fe38b7b610c0acd10296fef69d9b18eb7a9eb1f',
      GenesisBlocks['avalanche'],
      DefaultTokenList.WBTC
    ), // WBTC.e
    getCompoundPoolConfig(
      'avalanche',
      '0xed6aaf91a2b084bd594dbd1245be3691f9f637ac',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDC
    ), // USDC.e
    getCompoundPoolConfig(
      'avalanche',
      '0x29472d511808ce925f501d25f9ee9effd2328db2',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'avalanche',
      '0x8b650e26404ac6837539ca96812f0123601e4448',
      GenesisBlocks['avalanche'],
      DefaultTokenList.USDT
    ), // USDT.e
    getCompoundPoolConfig(
      'avalanche',
      '0xc988c170d0e38197dc634a45bf00169c7aa7ca19',
      GenesisBlocks['avalanche'],
      DefaultTokenList.DAI
    ), // DAI.e
    getCompoundPoolConfig(
      'avalanche',
      '0x585e7bc75089ed111b656faa7aeb1104f5b96c15',
      GenesisBlocks['avalanche'],
      DefaultTokenList.LINK
    ), // LINK
    getCompoundPoolConfig(
      'avalanche',
      '0xce095a9657a02025081e0607c8d8b081c76a75ea',
      GenesisBlocks['avalanche'],
      DefaultTokenList.MIM
    ), // MIM
  ],
};

export const TraderJoeExchangeConfigs: UniswapProtocolConfig = {
  name: 'traderjoe',
  subgraphs: ['https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange'],
};
