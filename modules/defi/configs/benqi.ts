import { getChainConfig } from '../../../core/constants/chains';
import { CompoundLendingConfig } from './compound';

export const BenqiConfig: CompoundLendingConfig = {
  name: 'benqi',
  pools: [
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c',
      underlyingSymbol: 'AVAX',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'avalanche-2',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xF362feA9659cf036792c9cb02f8ff8198E21B4cB',
      underlyingSymbol: 'sAVAX',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'benqi-liquid-staked-avax',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568',
      underlyingSymbol: 'BTC',
      underlyingDecimals: 8,
      underlyingCoingeckoId: 'bitcoin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x334AD834Cd4481BB02d09615E7c11a00579A7909',
      underlyingSymbol: 'ETH',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'ethereum',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x4e9f683A27a6BdAD3FC2764003759277e93696e6',
      underlyingSymbol: 'LINK',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'chainlink',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C',
      underlyingSymbol: 'USDT',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'tether',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F',
      underlyingSymbol: 'USDC',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'usd-coin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF',
      underlyingSymbol: 'USDTn',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'tether',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0xB715808a78F6041E46d61Cb123C9B4A27056AE9C',
      underlyingSymbol: 'USDCn',
      underlyingDecimals: 6,
      underlyingCoingeckoId: 'usd-coin',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D',
      underlyingSymbol: 'DAI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'dai',
    },
    {
      chainConfig: getChainConfig('avalanche'),
      poolAddress: '0x35Bd6aedA81a7E5FC7A7832490e71F757b0cD9Ce',
      underlyingSymbol: 'QI',
      underlyingDecimals: 18,
      underlyingCoingeckoId: 'benqi',
    },
  ],
};
