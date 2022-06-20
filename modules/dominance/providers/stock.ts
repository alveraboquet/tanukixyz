import logger from '../../../core/logger';
import { ShareProviders } from '../../../core/types';
import { CoinConfig, CoinDateData } from '../types';
import DominanceProvider from './provider';

class StockProvider extends DominanceProvider {
  public readonly name: string = 'stock.provider';

  constructor(coinConfig: CoinConfig, shareProviders: ShareProviders) {
    super(coinConfig, shareProviders);
  }

  public async getDataInRange(fromTimestamp: number, toTimestamp: number): Promise<any> {
    const data: Array<CoinDateData> = [];

    try {
      const response = await this.providers.polygon.aggregate(this.config.ticker, fromTimestamp, toTimestamp);
      if (response.data && response.data['results']) {
        const results: Array<any> = response.data['results'] as Array<any>;
        for (let i = 0; i < results.length; i++) {
          const date = Math.floor(Number(results[i].t) / 1000);

          // const tickerDetail = await this.providers.polygon.getTickerDetail(this.config.ticker, date);
          // if (tickerDetail.data && tickerDetail.data['results']) {
          //   data.push({
          //     date: date,
          //     ticker: this.config.ticker,
          //     priceUSD: Number(results[i].c),
          //     volumeUSD: Number(results[i].v),
          //     marketCapUSD: Number(tickerDetail.data['results']['market_cap']),
          //   });
          // }

          data.push({
            date: date,
            ticker: this.config.ticker,
            priceUSD: Number(results[i].c),
            volumeUSD: Number(results[i].v),
            marketCapUSD: 0,
          });
        }
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query coin data',
        props: {
          ticker: this.config.ticker,
        },
        error: e.message,
      });
    }

    return data;
  }
}

export default StockProvider;
