import { DefaultTokenList } from '../constants/defaultTokenList';
import { GenesisBlocks } from '../constants/genesisBlocks';
import { getCurvePoolConfig } from '../helpers';
import { CurvePoolConfig, TokenConfig } from '../types';

export interface CurveProtocolConfig {
  name: string;
  tokenomics?: TokenConfig;
  subgraph: string;
  pools: Array<CurvePoolConfig>;
}

export const CurveConfigs: CurveProtocolConfig = {
  name: 'curve',
  tokenomics: DefaultTokenList.CRV,
  subgraph: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
  pools: [
    getCurvePoolConfig('ethereum', '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.DAI,
      DefaultTokenList.USDT,
      DefaultTokenList.USDC,
    ]),
    getCurvePoolConfig('ethereum', '0xDeBF20617708857ebe4F679508E7b7863a8A8EeE', GenesisBlocks['ethereum'], 'lending', [
      DefaultTokenList.DAI,
      DefaultTokenList.USDT,
      DefaultTokenList.USDC,
    ]),
    getCurvePoolConfig('ethereum', '0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2', GenesisBlocks['ethereum'], 'meta', [
      DefaultTokenList.ETH,
      {
        symbol: 'aETHc',
        coingeckoId: 'ankreth',
        chains: {
          ethereum: {
            decimals: 18,
            address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
          },
        },
      }
    ]),
  ],
};
