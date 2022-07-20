import { CompoundProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
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

export class CompoundRegistryProvider extends RegistryProvider {
  public readonly name: string = 'provider.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  public async getAddressSnapshot(props: GetAddressSnapshotProps): Promise<Array<RegistryAddressData>> {
    const { providers, timestamp } = props;

    const data: Array<RegistryAddressData> = [];

    const foundAddresses: {
      [key: string]: {
        chain: string;
        address: string;
        markets: Array<CompoundAddressMarketData>;
      };
    } = {};

    const configs: CompoundProtocolConfig = this.configs as CompoundProtocolConfig;
    if (configs.subgraphs) {
      for (let subIdx = 0; subIdx < configs.subgraphs.length; subIdx++) {
        let blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
          configs.subgraphs[subIdx].chainConfig.subgraph?.blockSubgraph as string,
          timestamp
        );
        // in case the graph not full sync yet
        const blockNumberMeta = await providers.subgraph.queryMetaLatestBlock(configs.subgraphs[subIdx].lending);
        blockAtTimestamp = blockAtTimestamp > blockNumberMeta ? blockNumberMeta : blockAtTimestamp;

        let startAccountId = '0';

        const foundAddressMarket: any = {};

        while (true) {
          const query = `
            {
              accounts: accountCTokens(first: 1000, where: {account_gt: "${startAccountId}"}, block: {number: ${blockAtTimestamp}}) {
                account {
                  id
                }
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
            }
          `;
          const response = await providers.subgraph.querySubgraph(configs.subgraphs[subIdx].lending, query);
          const accounts: Array<any> = response && response.accounts ? response.accounts : [];

          for (let aIdx = 0; aIdx < accounts.length; aIdx++) {
            const addressKey = `${configs.subgraphs[subIdx].chainConfig.name}:${normalizeAddress(
              accounts[aIdx].account.id
            )}`;
            const marketKey = `${configs.subgraphs[subIdx].chainConfig.name}:${normalizeAddress(
              accounts[aIdx].account.id
            )}:${normalizeAddress(accounts[aIdx].market.id)}`;

            const marketData: CompoundAddressMarketData = {
              marketAddress: normalizeAddress(accounts[aIdx].market.id),
              underlyingSymbol: accounts[aIdx].market.underlyingSymbol,
              enteredMarket: accounts[aIdx].enteredMarket,
              totalUnderlyingSupplied: accounts[aIdx].totalUnderlyingSupplied,
              totalUnderlyingRedeemed: accounts[aIdx].totalUnderlyingRedeemed,
              totalUnderlyingBorrowed: accounts[aIdx].totalUnderlyingBorrowed,
              totalUnderlyingRepaid: accounts[aIdx].totalUnderlyingRepaid,
            };

            if (!foundAddresses[addressKey]) {
              foundAddresses[addressKey] = {
                chain: configs.subgraphs[subIdx].chainConfig.name,
                address: normalizeAddress(accounts[aIdx].account.id),
                markets: [],
              };
            }

            if (!foundAddressMarket[marketKey]) {
              foundAddresses[addressKey].markets.push(marketData);
              foundAddressMarket[marketKey] = true;
            }
          }

          if (accounts.length > 0) {
            startAccountId = accounts[accounts.length - 1].account.id;
          } else {
            break;
          }

          logger.onDebug({
            source: this.name,
            message: `collected ${Object.keys(foundAddresses).length} accounts data`,
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

    for (const [, accountData] of Object.entries(foundAddresses)) {
      data.push({
        chain: accountData.chain,
        address: accountData.address,
        protocol: configs.name,
        timestamp: timestamp,

        breakdown: {
          markets: accountData.markets,
        },
      });
    }

    return data;
  }
}
