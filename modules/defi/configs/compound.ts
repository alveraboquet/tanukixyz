import { getChainConfig } from '../../../core/constants/chains';
import { ChainConfig } from '../../../core/types';

export interface CompoundLendingPoolConfig {
  chainConfig: ChainConfig;
  poolAddress: string; // cToken poolAddress
  underlyingSymbol: string;
  underlyingDecimals: number;
  underlyingCoingeckoId: string;
}

export interface CompoundLendingConfig {
  name: string;
  pools: Array<CompoundLendingPoolConfig>;
}

export const CompoundConfig: CompoundLendingConfig = {
  name: 'compound',
  pools: [
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c',
      underlyingSymbol: 'AAVE',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'aave',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
      underlyingSymbol: 'BAT',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'basic-attention-token',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4',
      underlyingSymbol: 'COMP',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'compound-governance-token',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
      underlyingSymbol: 'DAI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'dai',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
      underlyingSymbol: 'ETH',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'ethereum',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x7713dd9ca933848f6819f38b8352d9a15ea73f67',
      underlyingSymbol: 'FEI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'fei-usd',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xface851a4921ce59e912d19329929ce6da6eb0c7',
      underlyingSymbol: 'LINK',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'chainlink',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b',
      underlyingSymbol: 'MKR',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'maker',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
      underlyingSymbol: 'REP',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'augur',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
      underlyingSymbol: 'SAI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'dai',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7',
      underlyingSymbol: 'SUSHI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'sushi',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x12392f67bdf24fae0af363c24ac620a2f67dad86',
      underlyingSymbol: 'TUSD',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'true-usd',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x35a18000230da775cac24873d00ff85bccded550',
      underlyingSymbol: 'UNI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'uniswap',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
      underlyingSymbol: 'USDC',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'usd-coin',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x041171993284df560249b57358f931d9eb7b925d',
      underlyingSymbol: 'USDP',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'paxos-standard',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      underlyingSymbol: 'USDT',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'tether',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
      underlyingSymbol: 'WBTC',
      underlyingDecimals: 8,
      underlyingCoingeckoId: 'bitcoin',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xccf4429db6322d5c611ee964527d42e5d685dd6a',
      underlyingSymbol: 'WBTC',
      underlyingDecimals: 8,
      underlyingCoingeckoId: 'bitcoin',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946',
      underlyingSymbol: 'YFI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'yearn-finance',
    },
    {
      chainConfig: getChainConfig('ethereum'),
      poolAddress: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
      underlyingSymbol: 'ZRX',
      underlyingDecimals: 18,
      underlyingCoingeckoId: '0x',
    },
  ],
};
