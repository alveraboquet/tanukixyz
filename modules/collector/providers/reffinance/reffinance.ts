import axios from 'axios';

import { RefFinanceConfig } from '../../../../configs/protocols/reffinance';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

export class RefFinanceProvider extends CollectorProvider {
  public readonly name: string = 'provider.reffinance';

  constructor(configs: RefFinanceConfig) {
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

    const configs: RefFinanceConfig = this.configs;

    // volume, revenue, tvl
    try {
      const response = await axios.get(configs.apiEndpoints.topPools);
      if (response.data) {
        const pools: Array<any> = response.data;
        for (let i = 0; i < pools.length; i++) {
          const feePercentage = (parseInt(pools[i]['total_fee']) * 100) / 10000;
          data.revenueUSD += (Number(pools[i]['volume24hinUSD']) * feePercentage) / 100;
          data.volumeInUseUSD += Number(pools[i]['volume24hinUSD']);
          data.totalValueLockedUSD += Number(pools[i]['tvl']);
        }
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query api data',
        props: {
          endpoint: configs.apiEndpoints.topPools,
        },
        error: e.message,
      });
    }

    // user, txn count, using subgraph
    try {
      const currentTime = date;
      const last24Hours = date - 24 * 60 * 60;
      const query = `
        {
          swap: swaps(where: {blockTimestamp_gte: ${last24Hours}, blockTimestamp_lte: ${currentTime}}) {
            id
          }
          addLiquidity: addLiquidities(where: {blockTimestamp_gte: ${last24Hours}, blockTimestamp_lte: ${currentTime}}) {
            id
          }
        }
      `;
      const response = await providers.subgraph.querySubgraph(configs.subgraph, query);
      const addresses: any = {};
      if (response['swap'] && response['addLiquidity']) {
        for (let i = 0; i < response['swap'].length; i++) {
          if (!addresses[response['swap'][i].id]) {
            addresses[response['swap'][i].id] = true;
            data.userCount += 1;
          }
        }
        for (let i = 0; i < response['addLiquidity'].length; i++) {
          addresses[response['addLiquidity'][i].id] = true;
          data.userCount += 1;
        }

        data.transactionCount += response['swap'].length;
        data.transactionCount += response['addLiquidity'].length;
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query subgraph data',
        props: {
          endpoint: configs.subgraph,
        },
        error: e.message,
      });
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
