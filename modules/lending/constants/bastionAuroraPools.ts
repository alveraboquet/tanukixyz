import LendEther from '../../../core/abi/compound/LendEther.json';
import LendToken from '../../../core/abi/compound/LendToken.json';
import { LendingPool } from '../types';

export const BastionAuroraPools: Array<LendingPool> = [
  {
    abi: LendEther,
    genesisBlock: 60838001,
    poolAddress: '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0',
    underlyingSymbol: 'ETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: LendToken,
    genesisBlock: 62015265,
    poolAddress: '0xfa786baC375D8806185555149235AcDb182C033b',
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: LendToken,
    genesisBlock: 60838331,
    poolAddress: '0x8C14ea853321028a7bb5E4FB0d0147F183d3B677',
    underlyingSymbol: 'NEAR',
    underlyingDecimals: 24,
    underlyingCoingeckoId: 'near',
  },
  {
    abi: LendToken,
    genesisBlock: 60838382,
    poolAddress: '0xe5308dc623101508952948b141fD9eaBd3337D99',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'usd-coin',
  },
  {
    abi: LendToken,
    genesisBlock: 60838421,
    poolAddress: '0x845E15A441CFC1871B7AC610b0E922019BaD9826',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: LendToken,
    genesisBlock: 64004000,
    poolAddress: '0x08Ac1236ae3982EC9463EfE10F0F320d9F5A9A4b',
    underlyingSymbol: 'BSTN',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'bastion-protocol',
  },
];
