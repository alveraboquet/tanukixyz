import axios from 'axios';

import { sleep } from '../../../core/helper';
import logger from '../../../core/logger';
import { ShareProviders } from '../../../core/types';
import { CoinConfig, CoinDateData } from '../types';
import DominanceProvider from './provider';

class CryptoProvider extends DominanceProvider {
  public readonly name: string = 'crypto.provider';

  constructor(coinConfig: CoinConfig, shareProviders: ShareProviders) {
    super(coinConfig, shareProviders);
  }

  public async getDataInRange(fromTimestamp: number, toTimestamp: number): Promise<any> {
    const data: Array<CoinDateData> = [];

    try {
      await sleep(1);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${this.config.id}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`
      );

      if (response.data) {
        const prices = response.data['prices'];
        const marketCaps = response.data['market_caps'];
        const volumes = response.data['total_volumes'];

        for (let i = 0; i < prices.length; i++) {
          data.push({
            date: Math.floor(Number(prices[i][0]) / 1000),
            ticker: this.config.ticker,
            priceUSD: Number(prices[i][1]),
            volumeUSD: Number(volumes[i][1]),
            marketCapUSD: Number(marketCaps[i][1]),
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

export default CryptoProvider;
