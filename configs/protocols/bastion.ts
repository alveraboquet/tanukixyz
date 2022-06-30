import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCompoundPoolConfig } from '../helpers';
import { CompoundProtocolConfig } from '../types';

export const BastionConfigs: CompoundProtocolConfig = {
  name: 'bastion',
  tokenomics: DefaultTokenList.BSTN,
  pools: [
    getCompoundPoolConfig(
      'aurora',
      '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0',
      GenesisBlocks['aurora'],
      DefaultTokenList.ETH
    ), // ETH
    getCompoundPoolConfig(
      'aurora',
      '0xfa786baC375D8806185555149235AcDb182C033b',
      GenesisBlocks['aurora'],
      DefaultTokenList.WBTC
    ), // WBTC
    getCompoundPoolConfig(
      'aurora',
      '0x8C14ea853321028a7bb5E4FB0d0147F183d3B677',
      GenesisBlocks['aurora'],
      DefaultTokenList.NEAR
    ), // NEAR
    getCompoundPoolConfig(
      'aurora',
      '0xe5308dc623101508952948b141fD9eaBd3337D99',
      GenesisBlocks['aurora'],
      DefaultTokenList.USDC
    ), // USDC
    getCompoundPoolConfig(
      'aurora',
      '0x845E15A441CFC1871B7AC610b0E922019BaD9826',
      GenesisBlocks['aurora'],
      DefaultTokenList.USDT
    ), // USDT
    getCompoundPoolConfig(
      'aurora',
      '0x08Ac1236ae3982EC9463EfE10F0F320d9F5A9A4b',
      GenesisBlocks['aurora'],
      DefaultTokenList.BSTN
    ), // BSTN
  ],
};
