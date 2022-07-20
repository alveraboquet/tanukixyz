import envConfig from '../../../../configs/env';
import { CompoundProtocolConfig } from '../../../../configs/types';
import { getNativeTokenPrice, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { RegistryAddressData } from '../../../../lib/types';
import RegistryProvider, { GetAddressSnapshotProps } from '../registry';

export interface CompoundAddressMarketData {
  marketAddress: string;
  underlyingSymbol: string;
  enteredMarket: boolean;
  totalUnderlyingSupplied: number;
  totalUnderlyingRedeemed: number;
  totalUnderlyingBorrowed: number;
  totalUnderlyingRepaid: number;
}

export interface CompoundAddressData {
  countLiquidated: number;
  countLiquidator: number;
  health: number;
  totalBorrowValueUSD: number;
  totalCollateralValueUSD: number;
  markets: Array<CompoundAddressMarketData>;
}

export class CompoundRegistryProvider extends RegistryProvider {
  public readonly name: string = 'provider.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  public async syncSnapshotAddressData(props: GetAddressSnapshotProps): Promise<void> {
    const { providers, timestamp, snapshot } = props;

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );
    const addressSnapshotRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddressSnapshot
    );

    const configs: CompoundProtocolConfig = this.configs as CompoundProtocolConfig;

    if (configs.subgraphs) {
      for (let subIdx = 0; subIdx < configs.subgraphs.length; subIdx++) {
        logger.onInfo({
          source: this.name,
          message: 'collecting registry address data',
          props: {
            protocol: configs.name,
            chain: configs.subgraphs[subIdx].chainConfig.name,
            timestamp: timestamp,
            subgraph: configs.subgraphs[subIdx].lending,
          },
        });

        const nativeTokenPrice = await getNativeTokenPrice(configs.subgraphs[subIdx].chainConfig.name, timestamp);

        let blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
          configs.subgraphs[subIdx].chainConfig.subgraph?.blockSubgraph as string,
          timestamp
        );
        // in case the graph not full sync yet
        const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(configs.subgraphs[subIdx].lending);
        blockAtTimestamp = blockAtTimestamp > blockNumberMeta ? blockNumberMeta : blockAtTimestamp;

        let startAccountId = '0';

        while (true) {
          const query = `
            {
              accounts: accounts(first: 1000, where: {id_gt: "${startAccountId}"}, block: {number: ${blockAtTimestamp}}) {
                id
                tokens(first: 1000) {
                  market {
                    id
                    underlyingSymbol
                  }
                  enteredMarket
                  totalUnderlyingSupplied
                  totalUnderlyingRedeemed
                  totalUnderlyingBorrowed
                  totalUnderlyingRepaid
                }
                countLiquidated
                countLiquidator
                health
                totalBorrowValueInEth
                totalCollateralValueInEth
              }
            }
          `;
          const response = await providers.subgraph.querySubgraph(configs.subgraphs[subIdx].lending, query);
          const accounts: Array<any> = response && response.accounts ? response.accounts : [];

          const operations: Array<any> = [];

          for (let aIdx = 0; aIdx < accounts.length; aIdx++) {
            const address: RegistryAddressData = {
              chain: configs.subgraphs[subIdx].chainConfig.name,
              address: normalizeAddress(accounts[aIdx].id),
              protocol: configs.name,
              timestamp: timestamp,
              breakdown: {},
            };

            const addressData: CompoundAddressData = {
              countLiquidated: Number(accounts[aIdx].countLiquidated),
              countLiquidator: Number(accounts[aIdx].countLiquidator),
              health: Number(accounts[aIdx].health),
              totalBorrowValueUSD: Number(accounts[aIdx].totalBorrowValueInEth) * nativeTokenPrice,
              totalCollateralValueUSD: Number(accounts[aIdx].totalCollateralValueInEth) * nativeTokenPrice,
              markets: [],
            };

            const foundAddressMarket: any = {};
            for (let marketIdx = 0; marketIdx < accounts[aIdx].tokens.length; marketIdx++) {
              const marketKey = normalizeAddress(accounts[aIdx].tokens[marketIdx].market.id);

              const marketData: CompoundAddressMarketData = {
                marketAddress: normalizeAddress(accounts[aIdx].tokens[marketIdx].market.id),
                underlyingSymbol: accounts[aIdx].tokens[marketIdx].market.underlyingSymbol,
                enteredMarket: accounts[aIdx].tokens[marketIdx].enteredMarket,
                totalUnderlyingSupplied: accounts[aIdx].tokens[marketIdx].totalUnderlyingSupplied,
                totalUnderlyingRedeemed: accounts[aIdx].tokens[marketIdx].totalUnderlyingRedeemed,
                totalUnderlyingBorrowed: accounts[aIdx].tokens[marketIdx].totalUnderlyingBorrowed,
                totalUnderlyingRepaid: accounts[aIdx].tokens[marketIdx].totalUnderlyingRepaid,
              };

              if (!foundAddressMarket[marketKey]) {
                addressData.markets.push(marketData);
                foundAddressMarket[marketKey] = true;
              }
            }

            address.breakdown = addressData;

            let filter: any = {};
            if (snapshot) {
              filter = {
                chain: address.chain,
                address: address.address,
                protocol: address.protocol,
                timestamp: timestamp,
              };
            } else {
              filter = {
                chain: address.chain,
                address: address.address,
                protocol: address.protocol,
              };
            }

            operations.push({
              updateOne: {
                filter: filter,
                update: {
                  $set: {
                    ...address,
                  },
                },
                upsert: true,
              }
            });
          }

          if (operations.length > 0) {
            if (snapshot) {
              await addressSnapshotRegistryCollection.bulkWrite(operations);
            } else {
              await addressRegistryCollection.bulkWrite(operations);
            }
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
              chain: configs.subgraphs[subIdx].chainConfig.name,
              timestamp: timestamp,
              subgraph: configs.subgraphs[subIdx].lending,
            },
          });
        }
      }
    }
  }
}
