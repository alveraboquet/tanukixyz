import BigNumber from 'bignumber.js';

import { ConvexProtocolConfig } from '../../../../configs/protocols/convex';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import CollectorProvider from '../collector';
import { queryCvxLockingTransactions, queryCvxStakingTransactions, queryLpStakingTransactions } from './helpers';

export class ConvexProvider extends CollectorProvider {
  public readonly name: string = 'provider.convex';

  constructor(configs: ConvexProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: ConvexProtocolConfig = this.configs;
    const cvxPrice = await getHistoryTokenPriceFromCoingecko('convex-finance', fromTime);
    const cvxCrvPrice = await getHistoryTokenPriceFromCoingecko('convex-crv', fromTime);

    const addresses: any = {};
    const transactions: any = {};

    const lpEvents: Array<any> = await queryLpStakingTransactions(configs, providers, fromTime, toTime);
    const stakingEvents: Array<any> = await queryCvxStakingTransactions(configs, providers, fromTime, toTime);
    const lockingEvents: Array<any> = await queryCvxLockingTransactions(configs, providers, fromTime, toTime);

    const allEvents = lpEvents.concat(stakingEvents).concat(lockingEvents);

    for (let i = 0; i < allEvents.length; i++) {
      const transactionId = allEvents[i].id.split('-')[0];
      const address = normalizeAddress(allEvents[i].user.id);
      if (!transactions[transactionId]) {
        data.transactionCount += 1;
        transactions[transactionId] = true;
      }
      if (!addresses[address]) {
        data.userCount += 1;
        addresses[address] = true;
      }

      if (allEvents[i].contract) {
        // CVX staking
        const tokenPrice = allEvents[i].contract.name === 'cvx' ? cvxPrice : cvxCrvPrice;
        const volume = new BigNumber(allEvents[i].amount).dividedBy(1e18).multipliedBy(tokenPrice).toNumber();
        data.volumeInUseUSD += volume;
      } else if (allEvents[i].poolid) {
        // LP staking
        const volume = new BigNumber(allEvents[i].amount)
          .dividedBy(1e18)
          .multipliedBy(new BigNumber(allEvents[i].poolid.lpTokenUSDPrice))
          .toNumber();
        data.volumeInUseUSD += volume;
      } else if (allEvents[i].amountUSD) {
        // CVX locking
        data.volumeInUseUSD += Number(allEvents[i].amountUSD);
      }
    }

    // count total value locked
    try {
      const lpQuery = `
        {
          pools(first: 1000) {
            tvl
          }
        }
      `;
      const response = await providers.subgraph.querySubgraph(configs.subgraph.curvePool, lpQuery);
      const pools: Array<any> = response && response['pools'] ? response['pools'] : [];
      for (let i = 0; i < pools.length; i++) {
        data.totalValueLockedUSD += Number(pools[i].tvl);
      }

      const stakingQuery = `
        {
          stakingContracts(first: 2) {
            name
            tokenBalance
          }
        }
      `;
      const stakingResponse = await providers.subgraph.querySubgraph(configs.subgraph.staking, stakingQuery);
      const stakingContracts: Array<any> =
        stakingResponse && stakingResponse['stakingContracts'] ? stakingResponse['stakingContracts'] : [];
      for (let i = 0; i < stakingContracts.length; i++) {
        const tokenPrice = stakingContracts[i].name === 'cvx' ? cvxPrice : cvxCrvPrice;
        data.totalValueLockedUSD += new BigNumber(stakingContracts[i].tokenBalance)
          .dividedBy(1e18)
          .multipliedBy(tokenPrice)
          .toNumber();
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query subgraph tvl',
        props: {
          endpoint: configs.subgraph.curvePool,
        },
        error: e.message,
      });
    }

    return data;
  }
}
