import axios from 'axios';

import envConfig from '../core/env';
import { sleep } from '../core/helper';
import logger from '../core/logger';
import { Provider } from '../core/namespaces';

export const PolygonTickerDayApiEndpoint = 'https://api.polygon.io/v2/aggs/ticker';
export const PolygonTickerDetailApiEndpoint = 'https://api.polygon.io/v3/reference/tickers';

class PolygonProvider implements Provider {
  public readonly name: string = 'provider.polygon';

  private _noCallInOneMinute: number = 0;

  constructor() {}

  public async aggregate(ticker: string, fromTimestamp: number, toTimestamp: number): Promise<any> {
    const fromDate = new Date(fromTimestamp * 1000).toISOString().split('T')[0];
    const toDatDate = new Date(toTimestamp * 1000).toISOString().split('T')[0];
    return await this.queryPolygonApi(
      `${PolygonTickerDayApiEndpoint}/${ticker}/range/1/day/${fromDate}/${toDatDate}?adjusted=true&sort=desc&limit=365&apiKey=${envConfig.apiKeys.polygonio}`
    );
  }

  public async getTickerDetail(ticker: string, dateTimestamp: number): Promise<any> {
    const theDate = new Date(dateTimestamp * 1000).toISOString().split('T')[0];
    return await this.queryPolygonApi(
      `${PolygonTickerDetailApiEndpoint}/${ticker}?date=${theDate}&apiKey=${envConfig.apiKeys.polygonio}`
    );
  }

  private async queryPolygonApi(endpoint: string): Promise<any> {
    if (this._noCallInOneMinute >= 5) {
      logger.onDebug({
        source: this.name,
        message: 'polygon.io limit, sleep 1 minute',
        props: {
          ticker: endpoint,
        },
      });
      await sleep(65);
      this._noCallInOneMinute = 0;
    } else {
      this._noCallInOneMinute += 1;
    }

    return await axios.get(endpoint);
  }
}

export default PolygonProvider;
