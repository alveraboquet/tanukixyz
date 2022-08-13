import ArbitrumDefault from '../lists/arbitrum-default.json';
import CeloDefault from '../lists/celo-default.json';
import PancakeswapDefault from '../lists/pancakeswap-default.json';
import SushiswapDefaultFantom from '../lists/sushiswap-fantom.json';
import TraderjoeDefault from '../lists/traderjoe-default.json';
import UniswapDefaultEthereum from '../lists/uniswap-ethereum.json';
import UniswapDefaultPolygon from '../lists/uniswap-polygon.json';

export interface TokenList {
  chainId: number;
  lists: Array<Array<any>>;
}

export const DefaultTokenLists: { [key: string]: TokenList } = {
  ethereum: {
    chainId: 1,
    lists: [UniswapDefaultEthereum],
  },
  polygon: {
    chainId: 137,
    lists: [UniswapDefaultPolygon],
  },
  binance: {
    chainId: 56,
    lists: [PancakeswapDefault],
  },
  avalanche: {
    chainId: 43114,
    lists: [TraderjoeDefault],
  },
  fantom: {
    chainId: 250,
    lists: [SushiswapDefaultFantom],
  },
  arbitrum: {
    chainId: 42161,
    lists: [ArbitrumDefault],
  },
  celo: {
    chainId: 42220,
    lists: [CeloDefault],
  },
};
