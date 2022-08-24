import BigNumber from 'bignumber.js';

import { EulerProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';

export class EulerProvider extends CollectorProvider {
  public readonly name: string = 'collector.euler';

  constructor(configs: EulerProtocolConfig) {
    super(configs);
  }

  public async queryOverviewData(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    // query date data
    const metaBlock = await providers.subgraph.queryMetaLatestBlock(this.configs.graphEndpoint);
    const blockAtDate = await providers.subgraph.queryBlockAtTimestamp(
      this.configs.chainConfig.subgraph.blockSubgraph as string,
      toTime
    );
    const blockNumber = blockAtDate < metaBlock ? blockAtDate : metaBlock;

    let startTime = fromTime;
    while (startTime < toTime) {
      try {
        const query = `
				{
					deposit: hourlyDeposits(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					withdraw: hourlyWithdraws(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					borrow: hourlyBorrows(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					repay: hourlyRepays(where: {timestamp_gte: ${startTime}}) {
						count,
						totalUsdAmount,
					}
					overview: eulerOverviews(first: 1, block: {number: ${blockNumber}}) {
            totalBalancesUsd
          }
				}
			`;
        const response = await providers.subgraph.querySubgraph(this.configs.graphEndpoint as string, query);

        const deposits: Array<any> = response && response.deposit ? response.deposit : [];
        const withdraws: Array<any> = response && response.withdraw ? response.withdraw : [];
        const borrows: Array<any> = response && response.borrow ? response.borrow : [];
        const repays: Array<any> = response && response.repay ? response.repay : [];

        const events: Array<any> = deposits.concat(withdraws).concat(borrows).concat(repays);

        const overview: any =
          response && response.overview && response.overview.length > 0 ? response.overview[0] : null;

        for (const event of events) {
          let volume = new BigNumber(event.totalUsdAmount).dividedBy(1e18);

          // handle subgraph data errors
          if (volume.gte(1e18)) {
            volume = volume.dividedBy(1e18);
          }
          data.volumeInUseUSD += volume.toNumber();
          data.transactionCount += Number(event.count);
        }

        if (overview) {
          // count liquidity
          data.totalValueLockedUSD = new BigNumber(overview.totalBalancesUsd).dividedBy(1e18).toNumber();
        }
      } catch (e: any) {
        logger.onError({
          source: this.name,
          message: 'failed to get hourly data',
          props: {
            date: new Date(toTime * 1000).toISOString().split('T')[0],
            endpoint: this.configs.graphEndpoint,
          },
          error: e.message,
        });
      }

      // next hour
      startTime += 60 * 60;
    }

    return data;
  }

  public async queryTokenData(
    providers: ShareProviders,
    fromTime: number,
    toTime: number
  ): Promise<Array<ProtocolTokenData>> {
    const tokenData: Array<ProtocolTokenData> = [];

    // query all asset configs
    const assetResponse = await providers.subgraph.querySubgraph(
      this.configs.graphEndpoint,
      `
      {
        assets(first: 100) {
          id,
          symbol,
          decimals,
          totalBalancesUsd,
        }
      }
    `
    );
    const assets: Array<any> = assetResponse && assetResponse.assets ? assetResponse.assets : [];

    const tokens: { [key: string]: ProtocolTokenData } = {};
    for (const asset of assets) {
      tokens[normalizeAddress(asset.id)] = {
        chain: this.configs.chainConfig.name,
        address: normalizeAddress(asset.id),
        symbol: asset.symbol === 'FTX Token' ? 'FTX' : asset.symbol.toUpperCase(),
        decimals: Number(asset.decimals),

        volumeInUseUSD: 0,
        totalValueLockedUSD: new BigNumber(asset.totalBalancesUsd)
          .dividedBy(new BigNumber(10).pow(asset.decimals))
          .toNumber(),
        transactionCount: 0,
      };

      let startTime = fromTime;
      while (startTime < toTime) {
        const balanceChangesResponses = await providers.subgraph.querySubgraph(
          this.configs.graphEndpoint,
          `
            {
              balanceChanges(first: 1000, where: {asset: "${normalizeAddress(
                asset.id
              )}", timestamp_gte: ${startTime}}, orderBy: timestamp, orderDirection: asc) {
                timestamp,
                amountUsd,
              }
            }
          `
        );

        const balanceChanges: Array<any> =
          balanceChangesResponses && balanceChangesResponses['balanceChanges']
            ? balanceChangesResponses['balanceChanges']
            : [];

        for (const balanceChange of balanceChanges) {
          tokens[normalizeAddress(asset.id)].volumeInUseUSD += new BigNumber(balanceChange.amountUsd)
            .dividedBy(1e18)
            .toNumber();
          tokens[normalizeAddress(asset.id)].volumeInUseUSD += 1;
        }

        if (balanceChanges.length > 0) {
          startTime = Number(balanceChanges[balanceChanges.length - 1]['timestamp']) + 1;
        } else {
          // no more records
          break;
        }
      }
    }

    for (const [, token] of Object.entries(tokens)) {
      tokenData.push(token);
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

    const overviewData: ProtocolData = await this.queryOverviewData(providers, fromTime, toTime);

    data.revenueUSD = overviewData.revenueUSD;
    data.totalValueLockedUSD = overviewData.totalValueLockedUSD;
    data.volumeInUseUSD = overviewData.volumeInUseUSD;
    data.transactionCount = overviewData.transactionCount;

    if (data.detail) {
      data.detail.tokens = await this.queryTokenData(providers, fromTime, toTime);
    }

    return data;
  }
}
