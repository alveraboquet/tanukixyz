import axios from 'axios';

import { DefaultTokenList } from '../configs/constants/defaultTokenList';
import logger from './logger';

export function normalizeAddress(address: string | undefined): string {
  return address ? address.toLowerCase() : '';
}

export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// standard timestamp UTC
export function getTimestamp(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function getTodayUTCTimestamp() {
  const today = new Date().toISOString().split('T')[0];
  return Math.floor(new Date(today).getTime() / 1000);
}

// get start day timestamp of a timestamp
export function getStartDayTimestamp(timestamp: number) {
  const theDay = new Date(timestamp * 1000).toISOString().split('T')[0];
  return Math.floor(new Date(theDay).getTime() / 1000);
}

export async function getHistoryTokenPriceFromCoingecko(coingeckoId: string, timestamp: number): Promise<number> {
  try {
    const response = await axios.get(
      `https://oracle.tanukixyz.com/api/tokenstats?coingeckoId=${coingeckoId}&timestamp=${timestamp}`
    );
    if (response.data && response.data['data']) {
      return Number(response.data['data']['priceUSD']);
    }
  } catch (e: any) {}

  logger.onDebug({
    source: 'helper',
    message: 'get history token price return zero',
    props: {
      coingeckoId: coingeckoId,
      timestamp: timestamp,
    },
  });
  return 0;
}

export async function getNativeTokenPrice(chain: string, timestamp: number): Promise<number> {
  let coingeckoId: any;
  switch (chain) {
    case 'ethereum': {
      coingeckoId = DefaultTokenList.ETH.coingeckoId;
      break;
    }
    case 'avalanche': {
      coingeckoId = DefaultTokenList.AVAX.coingeckoId;
      break;
    }
    case 'binance': {
      coingeckoId = DefaultTokenList.BNB.coingeckoId;
      break;
    }
    case 'polygon': {
      coingeckoId = DefaultTokenList.MATIC.coingeckoId;
      break;
    }
    case 'fantom': {
      coingeckoId = DefaultTokenList.FTM.coingeckoId;
      break;
    }
    default:
      return 0;
  }

  return await getHistoryTokenPriceFromCoingecko(coingeckoId, timestamp);
}
