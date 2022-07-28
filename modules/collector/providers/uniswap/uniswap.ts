import { UniswapProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import { CollectorProvider } from '../collector';
import { CollectorHook } from '../hook';

export class UniswapProvider extends CollectorProvider {
  public readonly name: string = 'collector.uniswap';

  constructor(configs: UniswapProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  public getQueryRecordLimit(): number {
    return 1000;
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      dayData: {
        dayDataVar: 'uniswapDayDatas',
        totalVolume: 'dailyVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },

      factory: {
        factoryVar: 'uniswapFactories',
        totalVolume: 'totalVolumeUSD',
        totalLiquidity: 'totalLiquidityUSD',
        totalTransaction: 'txCount',
      },

      // support uniswap v3 queries
      v3: {
        dayData: {
          dayDataVar: 'poolDayDatas',
          totalFee: 'feesUSD',
          totalVolume: 'volumeUSD',
          totalLiquidity: 'tvlUSD',
          totalTransaction: 'txCount',
        },

        factory: {
          factoryVar: 'factories',
          totalFee: 'totalFeesUSD',
          totalVolume: 'totalVolumeUSD',
          totalLiquidity: 'totalValueLockedUSD',
          totalTransaction: 'txCount',
        },
      },
    };
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    for (let i = 0; i < this.configs.subgraphs.length; i++) {
      logger.onDebug({
        source: this.name,
        message: 'querying volume, tvl, tcxCount from subgraph',
        props: {
          name: this.configs.name,
          endpoint: this.configs.subgraphs[i].exchange,
        },
      });
      const filters: any =
        this.configs.subgraphs[i].version === 2 ? this.getFilters().factory : this.getFilters().v3.factory;

      let blockNumberFromTime: number;
      let blockNumberToTime: number;

      if (
        this.configs.subgraphs[i].exchange.includes('thegraph.com') ||
        this.configs.subgraphs[i].exchange.includes('streamingfast.io') ||
        this.configs.subgraphs[i].exchange.includes('graph.mm.finance') ||
        this.configs.subgraphs[i].exchange.includes('thegraph.roninchain.com')
      ) {
        // thegraph
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
          this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
          fromTime
        );
        blockNumberToTime = await providers.subgraph.queryBlockAtTimestamp(
          this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
          toTime
        );

        // in case the graph not full sync yet
        const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(this.configs.subgraphs[i].exchange);
        blockNumberToTime = blockNumberToTime > blockNumberMeta ? blockNumberMeta : blockNumberToTime;
      } else {
        // fura
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
          this.configs.subgraphs[i].exchange,
          fromTime
        );
        blockNumberToTime = await providers.subgraph.queryBlockAtTimestamp(this.configs.subgraphs[i].exchange, toTime);
      }

      const response = await providers.subgraph.querySubgraph(
        this.configs.subgraphs[i].exchange,
        `
				{
          data: ${filters.factoryVar}(block: {number: ${blockNumberToTime}}) {
            ${this.configs.subgraphs[i].version === 3 ? filters.totalFee : ''}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
            ${filters.totalTransaction}
          }
					data24: ${filters.factoryVar}(block: {number: ${blockNumberFromTime}}) {
					  ${this.configs.subgraphs[i].version === 3 ? filters.totalFee : ''}
						${filters.totalVolume}
						${filters.totalLiquidity}
						${filters.totalTransaction}
					}
				}
			`
      );

      const parsed = response && response['data'] ? response['data'][0] : null;
      const parsed24 = response && response['data24'] ? response['data24'][0] : null;

      if (parsed && parsed24) {
        const volumeUSD = Number(parsed[filters.totalVolume]) - Number(parsed24[filters.totalVolume]);
        data.revenueUSD +=
          this.configs.subgraphs[i].version === 2
            ? (volumeUSD * 0.3) / 100
            : Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
        data.volumeInUseUSD += volumeUSD;
        data.totalValueLockedUSD += Number(parsed[filters.totalLiquidity]);
        data.transactionCount += Number(parsed[filters.totalTransaction]) - Number(parsed24[filters.totalTransaction]);
      }

      // count users
      try {
        logger.onDebug({
          source: this.name,
          message: 'querying transactions and events',
          props: {
            name: this.configs.name,
            endpoint: this.configs.subgraphs[i].exchange,
          },
        });

        const addresses: any = {};

        let startTime = fromTime;
        const limit = this.getQueryRecordLimit();
        while (startTime <= toTime) {
          const transactionsResponses = await providers.subgraph.querySubgraph(
            this.configs.subgraphs[i].exchange,
            `
            {
              transactions(first: ${limit}, where: {timestamp_gte: ${startTime}}, orderBy: timestamp, orderDirection: asc) {
                timestamp
                swaps(first: 1000) {
                  sender
                  ${this.configs.subgraphs[i].version === 2 ? 'to' : 'recipient'}
                }
                mints(first: 1000) {
                  sender
                  ${this.configs.subgraphs[i].version === 2 ? 'to' : 'owner'},
                }
                burns(first: 1000) {
                  ${this.configs.subgraphs[i].version === 2 ? 'sender' : 'owner'}
                  ${this.configs.subgraphs[i].version === 2 ? 'to' : ''}
                }
              }
            }
          `
          );
          const transactions =
            transactionsResponses && transactionsResponses['transactions'] ? transactionsResponses['transactions'] : [];

          for (let i = 0; i < transactions.length; i++) {
            const events: Array<any> = transactions[i].swaps
              .concat(transactions[i].mints)
              .concat(transactions[i].burns);
            for (let eIdx = 0; eIdx < events.length; eIdx++) {
              if (events[eIdx].sender && !addresses[normalizeAddress(events[eIdx].sender)]) {
                data.userCount += 1;
                addresses[normalizeAddress(events[eIdx].sender)] = true;
              }
              if (events[eIdx].owner && !addresses[normalizeAddress(events[eIdx].owner)]) {
                data.userCount += 1;
                addresses[normalizeAddress(events[eIdx].owner)] = true;
              }
              if (events[eIdx].to && !addresses[normalizeAddress(events[eIdx].to)]) {
                data.userCount += 1;
                addresses[normalizeAddress(events[eIdx].to)] = true;
              }
              if (events[eIdx].recipient && !addresses[normalizeAddress(events[eIdx].recipient)]) {
                data.userCount += 1;
                addresses[normalizeAddress(events[eIdx].recipient)] = true;
              }
            }
          }

          if (transactions.length > 0) {
            startTime = Number(transactions[transactions.length - 1]['timestamp']) + 1;
          } else {
            // no more records
            break;
          }
        }
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'failed to count daily users',
          props: {
            name: this.configs.name,
            error: e.message,
          },
        });
      }
    }

    return data;
  }
}
