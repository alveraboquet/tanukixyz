import { getDefaultTokenAddresses, getDefaultTokenLogoURI } from '../../../../configs/helpers';
import { UniswapProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolDetailData } from '../../types';

export interface UniswapTokenData {
  chain: string;
  address: string;
  symbol: string;
  decimals: number;
  logoURI: string | null;
  totalVolumeUSD: number;
  totalLiquidityUSD: number;
  totalTxCount: number;
}

export interface UniswapDetailData extends ProtocolDetailData {
  data: {
    tokens: Array<UniswapTokenData>;
  };
}

export class UniswapProvider extends CollectorProvider {
  public readonly name: string = 'collector.uniswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
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

      token: {
        tokenTradeVolume: 'tradeVolumeUSD',
        tokenLiquidity: 'totalLiquidity',
        tokenTxCount: 'txCount',
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

        token: {
          tokenTradeVolume: 'volumeUSD',
          tokenLiquidity: 'totalValueLockedUSD',
          tokenTxCount: 'txCount',
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

    const detailData: UniswapDetailData = {
      version: 'univ2',
      data: {
        tokens: [],
      },
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
        this.configs.subgraphs[i].exchange.includes('api.fura.org') ||
        this.configs.subgraphs[i].exchange.includes('polygon.furadao.org')
      ) {
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
          this.configs.subgraphs[i].exchange,
          fromTime
        );
        blockNumberToTime = await providers.subgraph.queryBlockAtTimestamp(this.configs.subgraphs[i].exchange, toTime);
      } else {
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
          this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
          fromTime
        );
        blockNumberToTime = await providers.subgraph.safeQueryBlockAtTimestamp(
          this.configs.subgraphs[i].exchange as string,
          this.configs.subgraphs[i].chainConfig.subgraph?.blockSubgraph as string,
          toTime
        );
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

      // get tokens liquidity
      const tokenAddresses: Array<string> = getDefaultTokenAddresses(this.configs.subgraphs[i].chainConfig.name);
      const tokenFilters: any =
        this.configs.subgraphs[i].version === 2 ? this.getFilters().token : this.getFilters().v3.token;

      for (let address of tokenAddresses) {
        const tokenQuery = `
          {
            token(block: {number: ${blockNumberToTime}}, id: "${normalizeAddress(address)}") {
              id
              symbol
              decimals
              ${tokenFilters.tokenTradeVolume}
              ${tokenFilters.tokenLiquidity}
              ${tokenFilters.tokenTxCount}
            }
          }
        `;

        const tokenResponse = await providers.subgraph.querySubgraph(this.configs.subgraphs[i].exchange, tokenQuery);
        const parsedToken: any = tokenResponse && tokenResponse.token ? tokenResponse.token : null;
        if (parsedToken) {
          detailData.data.tokens.push({
            chain: this.configs.subgraphs[i].chainConfig.name,
            address: normalizeAddress(parsedToken.id),
            symbol: parsedToken.symbol,
            decimals: Number(parsedToken.decimals),
            logoURI: getDefaultTokenLogoURI(this.configs.subgraphs[i].chainConfig.name, parsedToken.id),
            totalVolumeUSD: Number(parsedToken[tokenFilters.tokenTradeVolume]),
            totalLiquidityUSD: Number(parsedToken[tokenFilters.tokenLiquidity]),
            totalTxCount: Number(parsedToken[tokenFilters.tokenTxCount]),
          });
        }
      }

      // get pool liquidity

      // count users
      // try {
      //   logger.onDebug({
      //     source: this.name,
      //     message: 'querying transactions and events',
      //     props: {
      //       name: this.configs.name,
      //       endpoint: this.configs.subgraphs[i].exchange,
      //     },
      //   });
      //
      //   const addresses: any = {};
      //
      //   let startTime = fromTime;
      //   const limit = this.getQueryRecordLimit();
      //   while (startTime <= toTime) {
      //     const transactionsResponses = await providers.subgraph.querySubgraph(
      //       this.configs.subgraphs[i].exchange,
      //       `
      //       {
      //         transactions(first: ${limit}, where: {timestamp_gte: ${startTime}}, orderBy: timestamp, orderDirection: asc) {
      //           timestamp
      //           swaps(first: 1000) {
      //             sender
      //             ${this.configs.subgraphs[i].version === 2 ? 'to' : 'recipient'}
      //           }
      //           mints(first: 1000) {
      //             sender
      //             ${this.configs.subgraphs[i].version === 2 ? 'to' : 'owner'},
      //           }
      //           burns(first: 1000) {
      //             ${this.configs.subgraphs[i].version === 2 ? 'sender' : 'owner'}
      //             ${this.configs.subgraphs[i].version === 2 ? 'to' : ''}
      //           }
      //         }
      //       }
      //     `
      //     );
      //     const transactions =
      //       transactionsResponses && transactionsResponses['transactions'] ? transactionsResponses['transactions'] : [];
      //
      //     for (let i = 0; i < transactions.length; i++) {
      //       const events: Array<any> = transactions[i].swaps
      //         .concat(transactions[i].mints)
      //         .concat(transactions[i].burns);
      //       for (let eIdx = 0; eIdx < events.length; eIdx++) {
      //         if (events[eIdx].sender && !addresses[normalizeAddress(events[eIdx].sender)]) {
      //           data.userCount += 1;
      //           addresses[normalizeAddress(events[eIdx].sender)] = true;
      //         }
      //         if (events[eIdx].owner && !addresses[normalizeAddress(events[eIdx].owner)]) {
      //           data.userCount += 1;
      //           addresses[normalizeAddress(events[eIdx].owner)] = true;
      //         }
      //         if (events[eIdx].to && !addresses[normalizeAddress(events[eIdx].to)]) {
      //           data.userCount += 1;
      //           addresses[normalizeAddress(events[eIdx].to)] = true;
      //         }
      //         if (events[eIdx].recipient && !addresses[normalizeAddress(events[eIdx].recipient)]) {
      //           data.userCount += 1;
      //           addresses[normalizeAddress(events[eIdx].recipient)] = true;
      //         }
      //       }
      //     }
      //
      //     if (transactions.length > 0) {
      //       startTime = Number(transactions[transactions.length - 1]['timestamp']) + 1;
      //     } else {
      //       // no more records
      //       break;
      //     }
      //   }
      // } catch (e: any) {
      //   logger.onDebug({
      //     source: this.name,
      //     message: 'failed to count daily users',
      //     props: {
      //       name: this.configs.name,
      //       error: e.message,
      //     },
      //   });
      // }
    }

    data.detail = detailData;

    return data;
  }
}
