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

  volumeUSD: number;
  liquidityUSD: number;
  txCount: number;
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

  private async queryFactoryData(
    providers: ShareProviders,
    subgraph: any,
    fromBlockNumber: number,
    toBlockNumber: number
  ): Promise<ProtocolData> {
    const factoryData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    logger.onDebug({
      source: this.name,
      message: 'querying factory data from subgraph',
      props: {
        name: this.configs.name, // name of protocol
        endpoint: subgraph.exchange, // exchange subgraph api endpoint
      },
    });
    const filters: any = subgraph.version === 2 ? this.getFilters().factory : this.getFilters().v3.factory;

    // now, we query subgraph using factory query
    const response = await providers.subgraph.querySubgraph(
      subgraph.exchange,
      `
				{
          data: ${filters.factoryVar}(block: {number: ${toBlockNumber}}) {
            ${subgraph.version === 3 ? filters.totalFee : ''}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
            ${filters.totalTransaction}
          }
					data24: ${filters.factoryVar}(block: {number: ${fromBlockNumber}}) {
					  ${subgraph.version === 3 ? filters.totalFee : ''}
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
      factoryData.revenueUSD =
        subgraph.version === 2
          ? (volumeUSD * 0.3) / 100
          : Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
      factoryData.volumeInUseUSD = volumeUSD;
      factoryData.totalValueLockedUSD = Number(parsed[filters.totalLiquidity]);
      factoryData.transactionCount =
        Number(parsed[filters.totalTransaction]) - Number(parsed24[filters.totalTransaction]);
    }

    return factoryData;
  }

  private async queryTokenData(
    providers: ShareProviders,
    subgraph: any,
    fromBlockNumber: number,
    toBlockNumber: number
  ): Promise<Array<UniswapTokenData>> {
    let tokenData: Array<UniswapTokenData> = [];

    logger.onDebug({
      source: this.name,
      message: 'querying tokens data from subgraph',
      props: {
        name: this.configs.name,
        endpoint: subgraph.exchange,
      },
    });

    const tokenAddresses: Array<string> = getDefaultTokenAddresses(subgraph.chainConfig.name);
    const tokenFilters: any = subgraph.version === 2 ? this.getFilters().token : this.getFilters().v3.token;

    for (let address of tokenAddresses) {
      const tokenQuery = `
        {
          token: token(block: {number: ${toBlockNumber}}, id: "${normalizeAddress(address)}") {
            id
            symbol
            decimals
            ${tokenFilters.tokenTradeVolume}
            ${tokenFilters.tokenLiquidity}
            ${tokenFilters.tokenTxCount}
          }
          token24: token(block: {number: ${fromBlockNumber}}, id: "${normalizeAddress(address)}") {
            id
            symbol
            decimals
            ${tokenFilters.tokenTradeVolume}
            ${tokenFilters.tokenLiquidity}
            ${tokenFilters.tokenTxCount}
          }
        }
      `;

      const tokenResponse = await providers.subgraph.querySubgraph(subgraph.exchange, tokenQuery);
      const parsed: any = tokenResponse && tokenResponse.token ? tokenResponse.token : null;
      const parsed24: any = tokenResponse && tokenResponse.token24 ? tokenResponse.token24 : null;
      if (parsed && parsed24) {
        tokenData.push({
          chain: subgraph.chainConfig.name,
          address: normalizeAddress(parsed.id),
          symbol: parsed.symbol,
          decimals: Number(parsed.decimals),
          logoURI: getDefaultTokenLogoURI(subgraph.chainConfig.name, parsed.id),

          volumeUSD: Number(parsed[tokenFilters.tokenTradeVolume]) - Number(parsed24[tokenFilters.tokenTradeVolume]),
          liquidityUSD: Number(parsed[tokenFilters.tokenLiquidity]),
          txCount: Number(parsed[tokenFilters.tokenTxCount]) - Number(parsed24[tokenFilters.tokenTxCount]),
        });
      }
    }

    // sort by trading volume
    tokenData = tokenData.sort(function (a: UniswapTokenData, b: UniswapTokenData) {
      return a.volumeUSD > b.volumeUSD ? -1 : 1;
    });

    return tokenData;
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

    for (let subgraph of this.configs.subgraphs) {
      let blockNumberFromTime: number; // block number at last 24 hours timestamp
      let blockNumberToTime: number; // block number at current timestamp

      if (subgraph.exchange.includes('api.fura.org') || subgraph.exchange.includes('polygon.furadao.org')) {
        // these endpoints use exchange and block in the same endpoint
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(subgraph.exchange, fromTime);
        blockNumberToTime = await providers.subgraph.queryBlockAtTimestamp(subgraph.exchange, toTime);
      } else {
        // these endpoints use exchange and block in the diff endpoints
        blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
          subgraph.chainConfig.subgraph?.blockSubgraph as string,
          fromTime
        );
        blockNumberToTime = await providers.subgraph.safeQueryBlockAtTimestamp(
          subgraph.exchange as string,
          subgraph.chainConfig.subgraph?.blockSubgraph as string,
          toTime
        );
      }

      // factory data
      const factoryData: ProtocolData = await this.queryFactoryData(
        providers,
        subgraph,
        blockNumberFromTime,
        blockNumberToTime
      );
      data.revenueUSD += factoryData.revenueUSD;
      data.totalValueLockedUSD += factoryData.totalValueLockedUSD;
      data.volumeInUseUSD += factoryData.volumeInUseUSD;
      data.userCount += factoryData.userCount;
      data.transactionCount += factoryData.transactionCount;

      // token data
      detailData.data.tokens = detailData.data.tokens.concat(
        await this.queryTokenData(providers, subgraph, blockNumberFromTime, blockNumberToTime)
      );
    }

    for (let i = 0; i < this.configs.subgraphs.length; i++) {
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
