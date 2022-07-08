import axios from 'axios';

import { DodoexProtocolConfig } from '../../../../configs/protocols/dodoex';
import logger from '../../../../lib/logger';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';

export class DodoexProvider extends CollectorProvider {
  public readonly name: string = 'provider.dodoex';

  constructor(configs: DodoexProtocolConfig) {
    super(configs);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const dailyData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: DodoexProtocolConfig = this.configs;

    try {
      const response = await axios.post(
        configs.subgraph,
        {
          operationName: 'FetchDashboardDailyData',
          variables: { where: { day: 365 } },
          query:
            'query FetchDashboardDailyData($where: Dashboardchain_daily_data_filter) {\n  dashboard_chain_day_data(where: $where) {\n    volume_near24h {\n      bsc\n      aurora\n      boba\n      ethereum\n      polygon\n      arbitrum\n      __typename\n    }\n    txCount_near24h {\n      bsc\n      aurora\n      boba\n      ethereum\n      polygon\n      arbitrum\n      __typename\n    }\n    traders_near24h {\n      bsc\n      aurora\n      boba\n      ethereum\n      arbitrum\n      polygon\n      __typename\n    }\n    tvl {\n      bsc\n      aurora\n      boba\n      ethereum\n      polygon\n      arbitrum\n      __typename\n    }\n    pools {\n      bsc\n      aurora\n      boba\n      ethereum\n      polygon\n      arbitrum\n      __typename\n    }\n    pairs {\n      bsc\n      aurora\n      boba\n      ethereum\n      polygon\n      arbitrum\n      __typename\n    }\n    list {\n      timestamp\n      date_str\n      txCount {\n        bsc\n        aurora\n        boba\n        ethereum\n        polygon\n        arbitrum\n        __typename\n      }\n      traders {\n        bsc\n        aurora\n        boba\n        ethereum\n        polygon\n        arbitrum\n        __typename\n      }\n      volume {\n        bsc\n        aurora\n        boba\n        ethereum\n        polygon\n        arbitrum\n        __typename\n      }\n      tvl {\n        bsc\n        aurora\n        boba\n        ethereum\n        polygon\n        arbitrum\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        },
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-gpc': '1',
            Referer: 'https://info.dodoex.io/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }
      );

      if (response.data && response.data.data) {
        dailyData.volumeInUseUSD +=
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['arbitrum']) +
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['bsc']) +
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['boba']) +
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['ethereum']) +
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['aurora']) +
          Number(response.data.data['dashboard_chain_day_data']['volume_near24h']['polygon']);

        dailyData.totalValueLockedUSD +=
          Number(response.data.data['dashboard_chain_day_data']['tvl']['arbitrum']) +
          Number(response.data.data['dashboard_chain_day_data']['tvl']['bsc']) +
          Number(response.data.data['dashboard_chain_day_data']['tvl']['boba']) +
          Number(response.data.data['dashboard_chain_day_data']['tvl']['ethereum']) +
          Number(response.data.data['dashboard_chain_day_data']['tvl']['aurora']) +
          Number(response.data.data['dashboard_chain_day_data']['tvl']['polygon']);

        dailyData.userCount +=
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['arbitrum']) +
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['bsc']) +
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['boba']) +
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['ethereum']) +
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['aurora']) +
          Number(response.data.data['dashboard_chain_day_data']['traders_near24h']['polygon']);

        dailyData.transactionCount +=
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['arbitrum']) +
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['bsc']) +
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['boba']) +
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['ethereum']) +
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['aurora']) +
          Number(response.data.data['dashboard_chain_day_data']['txCount_near24h']['polygon']);
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query protocol graphql',
        props: {
          name: this.name,
          endpoint: configs.subgraph,
        },
        error: e.message,
      });
    }

    return dailyData;
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
