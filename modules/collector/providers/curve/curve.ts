import axios from 'axios';

import { CurveProtocolConfig } from '../../../../configs/protocols/curve';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

export class CurveProvider extends CollectorProvider {
  public readonly name: string = 'provider.curve';

  constructor(configs: CurveProtocolConfig) {
    super(configs);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { providers, date } = props;

    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: CurveProtocolConfig = this.configs;
    const volumeApis: Array<string> = [
      'https://api.curve.fi/api/getAllPoolsVolume/ethereum',
      'https://api.curve.fi/api/getAllPoolsVolume/fantom',
      'https://api.curve.fi/api/getAllPoolsVolume/polygon',
      'https://api.curve.fi/api/getAllPoolsVolume/avalanche',
      'https://api.curve.fi/api/getAllPoolsVolume/xdai',
    ];
    for (let i = 0; i < volumeApis.length; i++) {
      try {
        const response = await axios.get(volumeApis[i]);
        if (response.data && response.data.data && response.data.data.totalVolume) {
          data.volumeInUseUSD += Number(response.data.data.totalVolume);
        }
      } catch (e: any) {
        logger.onWarn({
          source: this.name,
          message: 'failed to query api',
          props: {
            endpoint: volumeApis[i],
            error: e.message,
          },
        });
      }
    }

    // curve charge 0.04% on every swap
    // source: https://curve.fi/rootfaq
    data.revenueUSD = (data.volumeInUseUSD * 0.04) / 100;

    const tvlApis: Array<string> = [
      // ethereum
      'https://api.curve.fi/api/getTVL',
      'https://api.curve.fi/api/getPools/ethereum/factory',
      'https://api.curve.fi/api/getFactoryCryptoPools/ethereum',
      'https://api.curve.fi/api/getTVLCrypto',

      'https://api.curve.fi/api/getTVLPolygon',
      'https://api.curve.fi/api/getTVLAurora',
      'https://api.curve.fi/api/getTVLFantom',
      'https://api.curve.fi/api/getTVLxDai',
      'https://api.curve.fi/api/getTVLArbitrum',
      'https://api.curve.fi/api/getTVLAvalanche',
      'https://api.curve.fi/api/getTVLHarmony',
      'https://api.curve.fi/api/getTVLOptimism',
      'https://api.curve.fi/api/getTVLMoonbeam',
    ];
    for (let i = 0; i < tvlApis.length; i++) {
      try {
        const response = await axios.get(tvlApis[i]);
        if (response.data && response.data.data && response.data.data.tvl) {
          data.totalValueLockedUSD += Number(response.data.data.tvl);
        }
      } catch (e: any) {
        logger.onWarn({
          source: this.name,
          message: 'failed to query api',
          props: {
            endpoint: tvlApis[i],
            error: e.message,
          },
        });
      }
    }

    // count transaction and user
    const addresses: any = {};
    const transactions: any = {};
    let startTime = date - 24 * 60 * 60;
    while (startTime <= date) {
      try {
        const query = `
            {
              swaps(first: 1000, where: {timestamp_gte: ${startTime}}) {
                timestamp
                user {
                  id
                }
                transaction {
                  id
                }
              }
            }
          `;
        const response = await providers.subgraph.querySubgraph(configs.subgraph, query);
        const events = response.swaps && response.swaps.length > 0 ? response.swaps : [];
        for (let i = 0; i < events.length; i++) {
          if (!transactions[events[i].transaction.id.split('-')[0]]) {
            data.transactionCount += 1;
            transactions[events[i].transaction.id.split('-')[0]] = true;
          }
          if (!addresses[events[i].user.id.split('-')[0]]) {
            data.userCount += 1;
            addresses[events[i].user.id.split('-')[0]] = true;
          }
        }

        if (events.length > 0) {
          startTime = Number(events[events.length - 1].timestamp);
        } else {
          break;
        }
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'failed to count daily users, txs',
          props: {
            name: configs.name,
            error: e.message,
          },
        });
      }
    }

    return data;
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };
  }
}
