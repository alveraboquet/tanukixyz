import { CoinConfig, CoinType } from './types';

export const InitialSyncDate = 1577836800; // Wed Jan 01 2020 00:00:00 GMT+0000

export const CoinList: Array<CoinConfig> = [
  {
    id: 'apple',
    ticker: 'AAPL',
    type: CoinType.STOCK,
  },
  {
    id: 'facebook',
    ticker: 'FB',
    type: CoinType.STOCK,
  },
  {
    id: 'google',
    ticker: 'GOOGL',
    type: CoinType.STOCK,
  },
  {
    id: 'amazon',
    ticker: 'AMZN',
    type: CoinType.STOCK,
  },
  {
    id: 'tesla',
    ticker: 'TSLA',
    type: CoinType.STOCK,
  },
  {
    id: 'bitcoin',
    ticker: 'BTC',
    type: CoinType.CRYPTO,
  },
  {
    id: 'ethereum',
    ticker: 'ETH',
    type: CoinType.CRYPTO,
  },
];
