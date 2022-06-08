import axios from 'axios';
import { expect } from 'chai';

import { getTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { AggregatorArgv, DexConfig, DexDateData, IDexProvider } from '../types';

const API_ENDPOINTS: any = {
  tvls: [
    'https://api.curve.fi/api/getTVL',
    'https://api.curve.fi/api/getFactoryTVL',
    'https://api.curve.fi/api/getTVLPolygon',
    'https://api.curve.fi/api/getTVLFantom',
    'https://api.curve.fi/api/getTVLxDai',
    'https://api.curve.fi/api/getTVLArbitrum',
    'https://api.curve.fi/api/getTVLAvalanche',
    'https://api.curve.fi/api/getTVLHarmony',
    'https://api.curve.fi/api/getTVLOptimism',
    'https://api.curve.fi/api/getTVLAurora',
    'https://api.curve.fi/api/getTVLMoonbeam',
  ],
  volumes: [
    'https://api.curve.fi/api/getAllPoolsVolume/ethereum',
    'https://api.curve.fi/api/getAllPoolsVolume/avalanche',
    'https://api.curve.fi/api/getAllPoolsVolume/fantom',
    'https://api.curve.fi/api/getAllPoolsVolume/xdai',
    'https://api.curve.fi/api/getAllPoolsVolume/polygon',
    'https://api.curve.fi/api/getAllPoolsVolume/harmony',
    'https://api.curve.fi/api/getAllPoolsVolume/optimism',
    'https://api.curve.fi/api/getAllPoolsVolume/arbitrum',
    'https://api.curve.fi/api/getAllPoolsVolume/moonbeam',
  ],
};

export class CurveProvider implements IDexProvider {
  public readonly name: string = 'curve.provider';
  public readonly config: DexConfig;

  constructor(config: DexConfig) {
    this.config = config;
  }

  public async getDailyData(): Promise<DexDateData> {
    const data: DexDateData = {
      module: 'dex',
      date: getTimestamp(),
      name: 'curve',
      feeUSD: 0,
      volumeUSD: 0,
      liquidityUSD: 0,
      allTimeVolumeUSD: 0,
      transactionCount: 0,
    };

    try {
      // count volume
      for (let i = 0; i < API_ENDPOINTS.volumes.length; i++) {
        const response = await axios.get(API_ENDPOINTS.volumes[i]);
        if (response.data && response.data['data']['totalVolume']) {
          data.volumeUSD += Number(response.data['data']['totalVolume']);
        }
      }

      // count tvl
      for (let i = 0; i < API_ENDPOINTS.tvls.length; i++) {
        const response = await axios.get(API_ENDPOINTS.tvls[i]);
        if (response.data && response.data['data']['tvl']) {
          data.liquidityUSD += Number(response.data['data']['tvl']);
        }
      }
    } catch (e: any) {
      logger.onWarn({
        source: this.name,
        message: 'failed to query api data',
        props: {
          error: e.message,
        },
      });
    }

    return data;
  }

  getDateData(date: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async runAggregator(argv: AggregatorArgv): Promise<void> {}

  public async runTest(): Promise<void> {
    const dailyData: DexDateData = await this.getDailyData();

    expect(dailyData.volumeUSD).greaterThan(0);
    expect(dailyData.liquidityUSD).greaterThan(0);

    console.info(dailyData);
  }
}
