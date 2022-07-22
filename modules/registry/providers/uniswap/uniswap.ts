import BigNumber from 'bignumber.js';

import envConfig from '../../../../configs/env';
import { UniswapProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { RegistryAddressData } from '../../../../lib/types';
import RegistryProvider, { GetAddressSnapshotProps } from '../registry';
import { UniswapAddressData, UniswapAddressPoolData } from './types';

export class UniswapRegistryProvider extends RegistryProvider {
  public readonly name: string = 'provider.uniswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  private static _transformPoolData(data: any): UniswapAddressPoolData {
    return {
      poolAddress: normalizeAddress(data.pair.id),
      tokens: [
        {
          symbol: data.pair.token0.symbol,
          address: normalizeAddress(data.pair.token0.id),
        },
        {
          symbol: data.pair.token1.symbol,
          address: normalizeAddress(data.pair.token1.id),
        },
      ],
      liquidityBalance: Number(data.liquidityTokenBalance),
      liquidityTotalSupply: Number(data.pair.totalSupply),
    };
  }

  private static _transformPoolDataV3(data: any): UniswapAddressPoolData {
    return {
      poolAddress: normalizeAddress(data.pool.id),
      tokens: [
        {
          symbol: data.pool.token0.symbol,
          address: normalizeAddress(data.pool.token0.id),
        },
        {
          symbol: data.pool.token1.symbol,
          address: normalizeAddress(data.pool.token1.id),
        },
      ],
      liquidityBalance: new BigNumber(data.liquidity.toString()).dividedBy(1e18).toNumber(),
      liquidityTotalSupply: new BigNumber(data.pool.liquidity.toString()).dividedBy(1e18).toNumber(),
    };
  }

  private async _syncV2Data(props: GetAddressSnapshotProps, subgraph: any): Promise<void> {
    const { providers, timestamp } = props;

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );

    const configs: UniswapProtocolConfig = this.configs as UniswapProtocolConfig;

    const blockAtTimestamp = await providers.subgraph.safeQueryBlockAtTimestamp(
      subgraph.exchange,
      subgraph.chainConfig.subgraph.blockSubgraph,
      timestamp
    );

    // ignore zero address
    let startAccountId = '0x0000000000000000000000000000000000000000';

    while (true) {
      const query = `
        {
          accounts: users(first: 1000, where: {id_gt: "${startAccountId}"}, block: {number: ${blockAtTimestamp}}, orderBy: id, orderDirection: asc) {
            id
            liquidityPositions (first: 1000) {
              pair {
                id
                totalSupply
                token0 {
                  id
                  symbol
                }
                token1 {
                  id
                  symbol
                }
              }
              liquidityTokenBalance
            }
          }
        }
      `;
      const response = await providers.subgraph.querySubgraph(subgraph.exchange, query);
      const accounts: Array<any> = response && response.accounts ? response.accounts : [];

      const operations: Array<any> = [];

      for (let aIdx = 0; aIdx < accounts.length; aIdx++) {
        const address: RegistryAddressData = {
          chain: subgraph.chainConfig.name,
          address: normalizeAddress(accounts[aIdx].id),
          protocol: configs.name,
          timestamp: timestamp,
          breakdownVersion: 'univ2',
          breakdown: {},
        };

        const addressData: UniswapAddressData = {
          liquidityPositions: [],
        };

        for (let poolIdx = 0; poolIdx < accounts[aIdx].liquidityPositions.length; poolIdx++) {
          const poolData: UniswapAddressPoolData = UniswapRegistryProvider._transformPoolData(
            accounts[aIdx].liquidityPositions[poolIdx]
          );
          addressData.liquidityPositions.push(poolData);
        }

        address.breakdown = addressData;

        operations.push({
          updateOne: {
            filter: {
              chain: address.chain,
              address: address.address,
              protocol: address.protocol,
              breakdownVersion: address.breakdownVersion,
            },
            update: {
              $set: {
                ...address,
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await addressRegistryCollection.bulkWrite(operations);
      }

      if (accounts.length > 0) {
        startAccountId = accounts[accounts.length - 1].id;
      } else {
        break;
      }

      logger.onDebug({
        source: this.name,
        message: `collected ${operations.length} accounts data`,
        props: {
          name: configs.name,
          chain: subgraph.chainConfig.name,
          timestamp: timestamp,
          subgraph: subgraph.exchange,
        },
      });
    }
  }

  private async _syncV3Data(props: GetAddressSnapshotProps, subgraph: any): Promise<void> {
    const { providers, timestamp } = props;

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );

    const configs: UniswapProtocolConfig = this.configs as UniswapProtocolConfig;

    const blockAtTimestamp = await providers.subgraph.safeQueryBlockAtTimestamp(
      subgraph.exchange,
      subgraph.chainConfig.subgraph.blockSubgraph,
      timestamp
    );

    let startId = '0';
    let lastAccountId = '';
    while (true) {
      const query = `
        {
          accounts: positions(first: 1000, where: {id_gt: ${startId}}, block: {number: ${blockAtTimestamp}}, orderBy: id, orderDirection: asc) {
            id
            owner
          }
        }
      `;
      const response = await providers.subgraph.querySubgraph(subgraph.exchange, query);
      const accounts: Array<any> = response && response.accounts ? response.accounts : [];

      const operations: Array<any> = [];

      for (let aIdx = 0; aIdx < accounts.length; aIdx++) {
        if (normalizeAddress(accounts[aIdx].id) == lastAccountId) {
          lastAccountId = normalizeAddress(accounts[aIdx].id);
          continue;
        }

        const address: RegistryAddressData = {
          chain: subgraph.chainConfig.name,
          address: normalizeAddress(accounts[aIdx].id),
          protocol: configs.name,
          timestamp: timestamp,
          breakdownVersion: 'univ3',
          breakdown: {},
        };

        const addressData: UniswapAddressData = {
          liquidityPositions: [],
        };

        const positionQuery = `
          {
            positions: positions(first: 1000, where: {owner: "${accounts[aIdx].owner}"}, block: {number: ${blockAtTimestamp}}) {
              pool {
                id
                liquidity
                token0 {
                  id
                  symbol
                }
                token1 {
                  id
                  symbol
                }
              }
              liquidity
            }
          }
        `;
        const queryResponse = await providers.subgraph.querySubgraph(subgraph.exchange, positionQuery);
        const positions: Array<any> = queryResponse && queryResponse.positions ? queryResponse.positions : [];

        for (let poolIdx = 0; poolIdx < positions.length; poolIdx++) {
          const poolData: UniswapAddressPoolData = UniswapRegistryProvider._transformPoolDataV3(positions[poolIdx]);
          addressData.liquidityPositions.push(poolData);
        }

        address.breakdown = addressData;

        operations.push({
          updateOne: {
            filter: {
              chain: address.chain,
              address: address.address,
              protocol: address.protocol,
              breakdownVersion: address.breakdownVersion,
            },
            update: {
              $set: {
                ...address,
              },
            },
            upsert: true,
          },
        });

        // update next account id
        lastAccountId = normalizeAddress(accounts[aIdx].id);
      }

      if (operations.length > 0) {
        await addressRegistryCollection.bulkWrite(operations);
      }

      if (accounts.length > 0) {
        startId = accounts[accounts.length - 1].id;
      } else {
        break;
      }

      logger.onDebug({
        source: this.name,
        message: `collected ${operations.length} accounts data`,
        props: {
          name: configs.name,
          chain: subgraph.chainConfig.name,
          timestamp: timestamp,
          subgraph: subgraph.exchange,
        },
      });
    }
  }

  public async syncSnapshotAddressData(props: GetAddressSnapshotProps): Promise<void> {
    const { timestamp } = props;

    const configs: UniswapProtocolConfig = this.configs as UniswapProtocolConfig;

    if (configs.subgraphs) {
      for (let subIdx = 0; subIdx < configs.subgraphs.length; subIdx++) {
        logger.onInfo({
          source: this.name,
          message: 'collecting registry address data',
          props: {
            protocol: configs.name,
            chain: configs.subgraphs[subIdx].chainConfig.name,
            timestamp: timestamp,
            subgraph: configs.subgraphs[subIdx].exchange,
          },
        });

        if (configs.subgraphs[subIdx].version === 3) {
          await this._syncV3Data(props, configs.subgraphs[subIdx]);
        } else {
          await this._syncV2Data(props, configs.subgraphs[subIdx]);
        }
      }
    }
  }
}
