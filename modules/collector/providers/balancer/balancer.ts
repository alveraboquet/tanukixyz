import BigNumber from 'bignumber.js';

import { getDefaultTokenAddresses, getTokenByAddress } from '../../../../configs/helpers';
import { BalancerProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';

export class BalancerProvider extends CollectorProvider {
  public readonly name: string = 'collector.balancer';

  constructor(configs: BalancerProtocolConfig) {
    super(configs);
  }

  private async getOverviewData(
    providers: ShareProviders,
    subgraph: any,
    fromBlock: number,
    toBlock: number
  ): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const transactionCountFilter = `${subgraph.version === 1 ? 'txCount' : 'totalSwapCount'}`;
    const response = await providers.subgraph.querySubgraph(
      subgraph.exchange,
      `
          {
            startDate: balancers(first: 1, block: {number: ${fromBlock}}) {
              totalSwapFee
              totalSwapVolume
              ${transactionCountFilter}
              totalLiquidity
            }
            endDate: balancers(first: 1, block: {number: ${toBlock}}) {
              totalSwapFee
              totalSwapVolume
              ${transactionCountFilter}
              totalLiquidity
            }
          }
        `
    );

    if (
      response['startDate'] &&
      response['startDate'].length > 0 &&
      response['endDate'] &&
      response['endDate'].length > 0
    ) {
      data.revenueUSD +=
        Number(response['endDate'][0]['totalSwapFee']) - Number(response['startDate'][0]['totalSwapFee']);
      data.volumeInUseUSD +=
        Number(response['endDate'][0]['totalSwapVolume']) - Number(response['startDate'][0]['totalSwapVolume']);
      data.transactionCount +=
        Number(response['endDate'][0][transactionCountFilter]) -
        Number(response['startDate'][0][transactionCountFilter]);
      data.totalValueLockedUSD +=
        subgraph.version === 1
          ? new BigNumber(response['endDate'][0]['totalLiquidity']).dividedBy(1e18).toNumber()
          : Number(response['endDate'][0]['totalLiquidity']);
    }

    return data;
  }

  public async getTokenData(
    providers: ShareProviders,
    subgraph: any,
    timestamp: number,
    fromBlockNumber: number,
    toBlockNumber: number
  ) {
    let tokenData: Array<ProtocolTokenData> = [];

    if (subgraph.version === 1) return [];

    logger.onDebug({
      source: this.name,
      message: 'querying tokens data from subgraph',
      props: {
        name: this.configs.name,
        endpoint: subgraph.exchange,
      },
    });

    const tokenAddresses: Array<string> = getDefaultTokenAddresses(subgraph.chainConfig.name);
    for (const tokenAddress of tokenAddresses) {
      let query = `
        {
          token: token(id: "${normalizeAddress(tokenAddress)}", block: {number: ${toBlockNumber}}) {
            id,
            symbol,
            decimals,
            totalVolumeUSD
            totalBalanceUSD
            totalSwapCount
          }
          token24: token(id: "${normalizeAddress(tokenAddress)}", block: {number: ${fromBlockNumber}}) {
            id,
            symbol,
            decimals,
            totalVolumeUSD
            totalBalanceUSD
            totalSwapCount
          }
        }
      `;

      let response = await providers.subgraph.querySubgraph(subgraph.exchange, query);

      let token: any = response && response.token ? response.token : null;
      const token24: any = response && response.token24 ? response.token24 : null;

      // query total value lock
      query = `
        {
          tokenSnapshots(first: 1, where: {token: "${normalizeAddress(
            tokenAddress
          )}", timestamp_lte: ${timestamp}}, orderBy: timestamp, orderDirection: desc) {
            totalBalanceUSD
          }
        }
      `;

      // response = await providers.subgraph.querySubgraph(subgraph.exchange, query);
      // const snapshot: any =
      //   response && response.tokenSnapshots && response.tokenSnapshots.length > 0 ? response.tokenSnapshots[0] : null;
      //
      // let theTokenData: ProtocolTokenData;

      if (token && token24) {
        if (!token.symbol) {
          // get on-chain token symbol
          const tokenConfig: any = getTokenByAddress(subgraph.chainConfig.name, token.id);
          token.symbol = tokenConfig ? tokenConfig.symbol : null;
        }

        tokenData.push({
          chain: subgraph.chainConfig.name,
          address: normalizeAddress(token.id),
          symbol: token.symbol ? token.symbol.toUpperCase() : 'UNKNOWN',
          decimals: Number(token.decimals),

          volumeInUseUSD: Number(token.totalVolumeUSD) - Number(token24.totalVolumeUSD),
          totalValueLockedUSD:
            Number(token.totalBalanceUSD) < 0 ? Math.abs(Number(token.totalBalanceUSD)) : Number(token.totalBalanceUSD),
          transactionCount: Number(token.totalSwapCount) - Number(token24.totalSwapCount),
        });

        // if (snapshot) {
        //   theTokenData.totalValueLockedUSD = Number(snapshot.totalBalanceUSD);
        // }

        // tokenData.push(theTokenData);
      }
    }

    return tokenData;
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,

      detail: {
        tokens: [],
      },
    };

    for (const subgraph of this.configs.subgraphs) {
      const blockNumberStartDate = await providers.subgraph.queryBlockAtTimestamp(
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        fromTime
      );
      let blockNumberEndDate = await providers.subgraph.queryBlockAtTimestamp(
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        toTime
      );

      // in case subgraph not full sync yet
      const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(subgraph.exchange);
      blockNumberEndDate = blockNumberEndDate > blockNumberMeta ? blockNumberMeta : blockNumberEndDate;

      const overviewData: ProtocolData = await this.getOverviewData(
        providers,
        subgraph,
        blockNumberStartDate,
        blockNumberEndDate
      );

      data.revenueUSD += overviewData.revenueUSD;
      data.totalValueLockedUSD += overviewData.totalValueLockedUSD;
      data.volumeInUseUSD += overviewData.volumeInUseUSD;
      data.userCount += overviewData.userCount;
      data.transactionCount += overviewData.transactionCount;

      // token data
      // we check existed token in list
      if (data.detail) {
        const tokenData: Array<ProtocolTokenData> = await this.getTokenData(
          providers,
          subgraph,
          toTime,
          blockNumberStartDate,
          blockNumberEndDate
        );

        function findDupToken(address: string, tokenList: Array<ProtocolTokenData>): number {
          for (let i = 0; i < tokenList.length; i++) {
            if (normalizeAddress(address) === normalizeAddress(tokenList[i].address)) {
              return i;
            }
          }

          return -1;
        }

        for (const token of tokenData) {
          const index = findDupToken(token.address, data.detail.tokens);
          if (index < 0) {
            data.detail.tokens.push(token);
          } else {
            data.detail.tokens[index].volumeInUseUSD += token.volumeInUseUSD;
            data.detail.tokens[index].totalValueLockedUSD += token.totalValueLockedUSD;
            data.detail.tokens[index].transactionCount += token.transactionCount;
          }
        }

        // sort token by volume
        data.detail.tokens = data.detail.tokens.sort(function (a: ProtocolTokenData, b: ProtocolTokenData) {
          return a.volumeInUseUSD > b.volumeInUseUSD ? -1 : 1;
        });
      }
    }

    return data;
  }
}
