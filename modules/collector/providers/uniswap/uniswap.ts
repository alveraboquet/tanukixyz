import { getDefaultTokenAddresses } from '../../../../configs/helpers';
import { UniswapProtocolConfig } from '../../../../configs/types';
import { getNativeTokenPrice, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';

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
        derivedETH: 'derivedETH',
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
      feeUSD: 0,
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
      factoryData.feeUSD =
        subgraph.version === 2
          ? (volumeUSD * 0.3) / 100
          : Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
      factoryData.volumeInUseUSD = volumeUSD;
      factoryData.totalValueLockedUSD = Number(parsed[filters.totalLiquidity]);
      factoryData.transactionCount =
        Number(parsed[filters.totalTransaction]) - Number(parsed24[filters.totalTransaction]);
    }

    // uniswap-v3 subgraph has an issue with totalValueLockedUSD
    // we collect tvl by sum pool tvl
    if (subgraph.exchange === 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3') {
      factoryData.totalValueLockedUSD = 0;
      const sizeLimit = 1000;
      let lastPoolId = '';
      let pools: Array<any>;
      do {
        const poolResponse = await providers.subgraph.querySubgraph(
          subgraph.exchange,
          `
          {
            pools(first: 1000, where: {id_gt: "${lastPoolId}"}) {
              id
              totalValueLockedUSD
            }
          }
        `
        );
        pools = poolResponse && poolResponse.pools ? poolResponse.pools : [];

        for (const pool of pools) {
          if (normalizeAddress(pool.id) === '0xa850478adaace4c08fc61de44d8cf3b64f359bec') continue;
          factoryData.totalValueLockedUSD += Number(pool.totalValueLockedUSD);
        }

        lastPoolId = pools.length > 0 ? pools[pools.length - 1].id : '';
      } while (pools.length === sizeLimit);
    }

    return factoryData;
  }

  private async queryTokenData(
    providers: ShareProviders,
    subgraph: any,
    timestamp: number,
    fromBlockNumber: number,
    toBlockNumber: number
  ): Promise<Array<ProtocolTokenData>> {
    let tokenData: Array<ProtocolTokenData> = [];

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
    const derivedETHFilter: string = tokenFilters.derivedETH;

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
            ${subgraph.version === 2 ? derivedETHFilter : ''}
          }
          token24: token(block: {number: ${fromBlockNumber}}, id: "${normalizeAddress(address)}") {
            id
            symbol
            decimals
            ${tokenFilters.tokenTradeVolume}
            ${tokenFilters.tokenLiquidity}
            ${tokenFilters.tokenTxCount}
            ${subgraph.version === 2 ? derivedETHFilter : ''}
          }
        }
      `;

      const tokenResponse = await providers.subgraph.querySubgraph(subgraph.exchange, tokenQuery);
      const parsed: any = tokenResponse && tokenResponse.token ? tokenResponse.token : null;
      const parsed24: any = tokenResponse && tokenResponse.token24 ? tokenResponse.token24 : null;

      if (parsed && parsed24) {
        // uniswap v2 need multiple liquidity by ethPrice
        let liquidity = Number(parsed[tokenFilters.tokenLiquidity]);

        // quickswap use ETH as native token
        if (this.configs.name === 'quickswap') {
          const ethPrice = await getNativeTokenPrice('ethereum', timestamp);
          liquidity = Number(parsed[derivedETHFilter]) * liquidity * ethPrice;
        } else {
          if (subgraph.version === 2) {
            const ethPrice = await getNativeTokenPrice(subgraph.chainConfig.name, timestamp);
            liquidity = Number(parsed[derivedETHFilter]) * liquidity * ethPrice;
          }
        }

        tokenData.push({
          chain: subgraph.chainConfig.name,
          address: normalizeAddress(parsed.id),
          symbol: parsed.symbol.toUpperCase(),
          decimals: Number(parsed.decimals),

          volumeInUseUSD:
            Number(parsed[tokenFilters.tokenTradeVolume]) - Number(parsed24[tokenFilters.tokenTradeVolume]),
          totalValueLockedUSD: liquidity,
          transactionCount: Number(parsed[tokenFilters.tokenTxCount]) - Number(parsed24[tokenFilters.tokenTxCount]),
        });
      }
    }

    // sort by trading volume
    tokenData = tokenData.sort(function (a: ProtocolTokenData, b: ProtocolTokenData) {
      return a.volumeInUseUSD > b.volumeInUseUSD ? -1 : 1;
    });

    return tokenData;
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      feeUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
      detail: {
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
      data.feeUSD += factoryData.feeUSD;
      data.totalValueLockedUSD += factoryData.totalValueLockedUSD;
      data.volumeInUseUSD += factoryData.volumeInUseUSD;
      data.userCount += factoryData.userCount;
      data.transactionCount += factoryData.transactionCount;

      // token data
      // we check existed token in list
      if (data.detail) {
        const tokenData: Array<ProtocolTokenData> = await this.queryTokenData(
          providers,
          subgraph,
          toTime,
          blockNumberFromTime,
          blockNumberToTime
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
