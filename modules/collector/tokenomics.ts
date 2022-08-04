import axios from 'axios';

import { TokenConfig } from '../../configs/types';
import logger from '../../lib/logger';
import { Provider } from '../../lib/types';
import { ProtocolTokenomics } from './types';

class TokenomicsProvider implements Provider {
  public readonly name: string = 'module.tokenomics';
  public readonly token: TokenConfig;

  constructor(token: TokenConfig) {
    this.token = token;
  }

  public async getTokenomicsStats(date: number): Promise<ProtocolTokenomics> {
    try {
      const response = await axios.get(
        `https://oracle.tanukixyz.com/api/tokenstats?coingeckoId=${this.token.coingeckoId}&timestamp=${date}`
      );
      if (response.data && response.data['data']) {
        return {
          priceUSD: Number(response.data['data']['priceUSD']),
          marketCapUSD: Number(response.data['data']['marketCapUSD']),
        };
      }
    } catch (e: any) {
      logger.onWarn({
        source: this.name,
        message: 'failed to get token stats',
        props: {
          symbol: this.token.symbol,
          coingeckoId: this.token.coingeckoId,
          error: e.message,
        },
      });
    }

    return {
      priceUSD: 0,
      marketCapUSD: 0,
    };
  }
}

export default TokenomicsProvider;
