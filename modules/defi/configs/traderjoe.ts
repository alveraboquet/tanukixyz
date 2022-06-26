import { getChainConfig } from '../../../core/constants/chains';
import { CompoundLendingConfig } from './compound';

export const TraderJoeLendingConfig: CompoundLendingConfig = {
  name: 'traderjoe-lending',
  pools: [
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xc22f01ddc8010ee05574028528614634684ec29e',
      underlyingSymbol: 'WAVAX',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'avalanche-2',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x929f5cab61dfec79a5431a7734a68d714c4633fa',
      underlyingSymbol: 'WETH.e',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'ethereum',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x3fe38b7b610c0acd10296fef69d9b18eb7a9eb1f',
      underlyingSymbol: 'WBTC.e',
      underlyingDecimals: 8,
      underlyingCoingeckoId: 'bitcoin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xed6aaf91a2b084bd594dbd1245be3691f9f637ac',
      underlyingSymbol: 'USDC.e',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'usd-coin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x29472d511808ce925f501d25f9ee9effd2328db2',
      underlyingSymbol: 'USDC',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'usd-coin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x8b650e26404ac6837539ca96812f0123601e4448',
      underlyingSymbol: 'USDT.e',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'tether',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xc988c170d0e38197dc634a45bf00169c7aa7ca19',
      underlyingSymbol: 'DAI.e',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'dai',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x585e7bc75089ed111b656faa7aeb1104f5b96c15',
      underlyingSymbol: 'LINK',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'chainlink',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xce095a9657a02025081e0607c8d8b081c76a75ea',
      underlyingSymbol: 'MIM',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'magic-internet-money',
    },
  ],
};
