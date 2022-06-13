import axios from "axios";
import logger from "./logger";

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
  const theDate = new Date(timestamp * 1000);
  const dmy = theDate.toISOString().split('T')[0].split('-');
  const day = Number(dmy[2]) > 9 ? Number(dmy[2]) : `0${Number(dmy[2])}`;
  const month = Number(dmy[1]) > 9 ? Number(dmy[1]) : `0${Number(dmy[1])}`;
  try {
    await sleep(1); // avoid coingecko limit
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}/history?date=${day}-${month}-${dmy[0]}`
    );
    if (response.data) {
      return Number(response.data['market_data']['current_price']['usd']);
    }
  } catch (e: any) {}

  logger.onDebug({
    source: 'coingecko.helper',
    message: 'get history token price return zero',
    props: {
      coingeckoId: coingeckoId,
      timestamp: timestamp,
    }
  });
  return 0;
}
