import { RegistryTransactionVersion, UniswapProtocolConfig } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { RegistryTransactionData, ShareProviders } from '../../../../lib/types';
import RegistryProvider from '../registry';

export interface UniswapActionData {
  action: 'Swap' | 'Mint' | 'Burn';
  sender: string;
  recipient: string;
  amountUSD: number;
  pairAddress: string;
}

export interface UniswapBreakdownData {
  version: RegistryTransactionVersion;
  actions: Array<UniswapActionData>;
}

export class UniswapRegistryProvider extends RegistryProvider {
  public readonly name: string = 'provider.uniswap';

  constructor(configs: UniswapProtocolConfig) {
    super(configs);
  }

  public getQueryConfigs(): any {
    return {
      queryRecordLimit: 100,
      filters: {
        transactionBlock: 'blockNumber',
      },
    };
  }

  private async _transformUniswapData(
    transactionData: RegistryTransactionData,
    version: RegistryTransactionVersion,
    swaps: Array<any>,
    mints: Array<any>,
    burns: Array<any>
  ): Promise<RegistryTransactionData> {
    const breakdown: UniswapBreakdownData = {
      version: version,
      actions: [],
    };

    try {
      for (let i = 0; i < swaps.length; i++) {
        breakdown.actions.push({
          action: 'Swap',
          sender: normalizeAddress(swaps[i].sender),
          recipient: swaps[i].to ? normalizeAddress(swaps[i].to) : normalizeAddress(swaps[i].recipient),
          amountUSD: Number(swaps[i].amountUSD),
          pairAddress: swaps[i].pair ? normalizeAddress(swaps[i].pair.id) : normalizeAddress(swaps[i].pool.id),
        });
      }

      for (let i = 0; i < mints.length; i++) {
        breakdown.actions.push({
          action: 'Mint',
          sender: normalizeAddress(mints[i].sender),
          recipient: mints[i].to ? normalizeAddress(mints[i].to) : normalizeAddress(mints[i].recipient),
          amountUSD: Number(mints[i].amountUSD),
          pairAddress: mints[i].pair ? normalizeAddress(mints[i].pair.id) : normalizeAddress(mints[i].pool.id),
        });
      }

      for (let i = 0; i < burns.length; i++) {
        breakdown.actions.push({
          action: 'Burn',
          sender: normalizeAddress(burns[i].sender),
          recipient: burns[i].to ? normalizeAddress(burns[i].to) : normalizeAddress(burns[i].recipient),
          amountUSD: Number(burns[i].amountUSD),
          pairAddress: burns[i].pair ? normalizeAddress(burns[i].pair.id) : normalizeAddress(burns[i].pool.id),
        });
      }
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to transform uniswap data',
        props: {
          name: this.configs.name,
        },
        error: e.message,
      });
    }

    return {
      ...transactionData,
      breakdown: breakdown,
    };
  }

  public async getTransactionInTimeFrame(
    providers: ShareProviders,
    fromTime: number,
    toTime: number
  ): Promise<Array<RegistryTransactionData>> {
    const queryCount = this.getQueryConfigs().queryRecordLimit;
    const configs: UniswapProtocolConfig = this.configs as UniswapProtocolConfig;

    const transactions: Array<RegistryTransactionData> = [];

    for (let subIdx = 0; subIdx < configs.subgraphs.length; subIdx++) {
      let startTime = fromTime;

      while (startTime <= toTime) {
        const query = `
					{
						transactions(first: ${queryCount}, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
						  id
						  ${this.getQueryConfigs().filters.transactionBlock}
							timestamp
							swaps(first: ${queryCount}) {
								sender
								amountUSD
								${configs.subgraphs[subIdx].version === 2 ? 'to' : 'recipient'}
								${configs.subgraphs[subIdx].version === 2 ? 'pair{id}' : 'pool{id}'}
							}
							mints(first: ${queryCount}) {
								sender
								amountUSD
								${configs.subgraphs[subIdx].version === 2 ? 'to' : 'owner'}
								${configs.subgraphs[subIdx].version === 2 ? 'pair{id}' : 'pool{id}'}
							}
							burns(first: ${queryCount}) {
							  amountUSD
								${configs.subgraphs[subIdx].version === 2 ? 'sender' : 'owner'}
								${configs.subgraphs[subIdx].version === 2 ? 'to' : ''}
								${configs.subgraphs[subIdx].version === 2 ? 'pair{id}' : 'pool{id}'}
							}
						}
					}
				`;

        const response = await providers.subgraph.querySubgraph(configs.subgraphs[subIdx].exchange, query);
        const parsed: Array<any> = response && response['transactions'] ? response['transactions'] : [];

        for (let pIdx = 0; pIdx < parsed.length; pIdx++) {
          const version = configs.subgraphs[subIdx].version === 2 ? 'univ2' : 'univ3';
          const transformedTransaction: RegistryTransactionData = await this._transformUniswapData(
            {
              protocol: configs.name,
              chain: configs.subgraphs[subIdx].chainConfig.name,
              blockNumber: Number(parsed[pIdx][this.getQueryConfigs().filters.transactionBlock]),
              timestamp: Number(parsed[pIdx].timestamp),
              transactionHash: parsed[pIdx].id,
            },
            version,
            parsed[pIdx].swaps,
            parsed[pIdx].mints,
            parsed[pIdx].burns
          );
          transactions.push(transformedTransaction);
        }

        logger.onDebug({
          source: this.name,
          message: 'processed registry transactions',
          props: {
            name: this.configs.name,
            chain: this.configs.subgraphs[subIdx].chainConfig.name,
            txCount: parsed.length,
            timestamp: startTime,
          },
        });

        if (parsed.length > 0) {
          startTime = Number(parsed[parsed.length - 1].timestamp) + 1;
        } else {
          break;
        }
      }
    }

    return transactions;
  }
}
