import { WombatProtocolConfig } from '../../../../configs/protocols/wombat';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';

export class WombatProvider extends CollectorProvider {
  public readonly name: string = 'collector.wombat';

  constructor(configs: WombatProtocolConfig) {
    super(configs);
  }

  // override this methods match with new project definitions
  public getFilters(): any {
    return {
      protocol: {
        totalFee: 'totalCollectedFeeUSD',
        totalVolume: 'totalTradeVolumeUSD',
        totalLiquidity: 'totalLiabilityUSD',
      },

      token: {
        totalFee: 'totalCollectedFeeUSD',
        totalVolume: 'totalTradeVolumeUSD',
        totalLiquidity: 'liabilityUSD',
      },
    };
  }

  private async queryProtocolData(
    providers: ShareProviders,
    subgraph: any,
    fromBlockNumber: number,
    toBlockNumber: number
  ): Promise<ProtocolData> {
    const protocolData: ProtocolData = {
      feeUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    logger.onDebug({
      source: this.name,
      message: 'querying protocol data from subgraph',
      props: {
        name: this.configs.name, // name of protocol
        endpoint: subgraph.exchange, // exchange subgraph api endpoint
      },
    });
    const filters: any = this.getFilters().protocol;

    // now, we query subgraph using factory query
    const response = await providers.subgraph.querySubgraph(
      subgraph.exchange,
      `
				{
          data: protocol(id: 1, block: {number: ${toBlockNumber}}) {
            ${filters.totalFee}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
          }
					data24: protocol(id: 1, block: {number: ${fromBlockNumber}}) {
					  ${filters.totalFee}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
					}
				}
			`
    );

    const parsed = response && response['data'] ? response['data'] : null;
    const parsed24 = response && response['data24'] ? response['data24'] : null;

    if (parsed && parsed24) {
      protocolData.feeUSD = Number(parsed[filters.totalFee]) - Number(parsed24[filters.totalFee]);
      protocolData.volumeInUseUSD = Number(parsed[filters.totalVolume]) - Number(parsed24[filters.totalVolume]);
      protocolData.totalValueLockedUSD = Number(parsed[filters.totalLiquidity]);
    }

    return protocolData;
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

    const filters: any = this.getFilters().token;

    // query token addresses
    const tokenListQuery = `
      {
        tokens(first: 1000) {
          id
        }
      }
    `;
    const tokenListResponse = await providers.subgraph.querySubgraph(subgraph.exchange, tokenListQuery);
    const tokenConfigs: Array<any> = tokenListResponse && tokenListResponse.tokens ? tokenListResponse.tokens : [];
    const tokenAddresses: Array<string> = [];
    for (const config of tokenConfigs) {
      tokenAddresses.push(config.id);
    }

    for (let address of tokenAddresses) {
      const tokenQuery = `
        {
          token: token(block: {number: ${toBlockNumber}}, id: "${normalizeAddress(address)}") {
            id
            symbol
            decimals
            ${filters.totalFee}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
          }
          token24: token(block: {number: ${fromBlockNumber}}, id: "${normalizeAddress(address)}") {
            id
            symbol
            decimals
            ${filters.totalFee}
            ${filters.totalVolume}
            ${filters.totalLiquidity}
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
          symbol: parsed.symbol.toUpperCase(),
          decimals: Number(parsed.decimals),

          volumeInUseUSD: Number(parsed[filters.totalVolume]) - Number(parsed24[filters.totalVolume]),
          totalValueLockedUSD: Number(parsed[filters.totalLiquidity]),
          transactionCount: 0,
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

    for (const subgraph of this.configs.subgraphs) {
      const blockNumberFromTime = await providers.subgraph.queryBlockAtTimestamp(
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        fromTime
      );
      const blockNumberToTime = await providers.subgraph.safeQueryBlockAtTimestamp(
        subgraph.exchange as string,
        subgraph.chainConfig.subgraph?.blockSubgraph as string,
        toTime
      );

      // factory data
      const protocolData: ProtocolData = await this.queryProtocolData(
        providers,
        subgraph,
        blockNumberFromTime,
        blockNumberToTime
      );

      data.feeUSD += protocolData.feeUSD;
      data.totalValueLockedUSD += protocolData.totalValueLockedUSD;
      data.volumeInUseUSD += protocolData.volumeInUseUSD;
      data.userCount += protocolData.userCount;
      data.transactionCount += protocolData.transactionCount;

      // token data
      // we check existed token in list
      if (data.detail) {
        data.detail.tokens = await this.queryTokenData(
          providers,
          subgraph,
          toTime,
          blockNumberFromTime,
          blockNumberToTime
        );
      }
    }

    return data;
  }
}
