import AaveV3LendingPoolAbi from '../../../core/abi/aave/AaveV3LendingPool.json';
import { LendingPool } from '../types';

export const AaveV3FtmPools: Array<LendingPool> = [
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'DAI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'dai',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'udc-coin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x049d68029688eabf473097a2fc38ef61633a3c7a', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'fUSDT',
    underlyingDecimals: 6,
    underlyingCoingeckoId: 'tether',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'AAVE',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'aave',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'WBTC',
    underlyingDecimals: 8,
    underlyingCoingeckoId: 'bitcoin',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x1E4F97b9f9F913c46F1632781732927B9019C68b', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'CRV',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'curve-dao-token',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'WETH',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'ethereum',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'LINK',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'chainlink',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'SUSHI',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'sushi',
  },
  {
    abi: AaveV3LendingPoolAbi,
    poolAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // token address
    genesisBlock: 33142113,
    underlyingSymbol: 'WFTM',
    underlyingDecimals: 18,
    underlyingCoingeckoId: 'fantom',
  },
];
