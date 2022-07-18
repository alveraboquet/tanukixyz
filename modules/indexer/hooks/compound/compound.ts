import envConfig from '../../../../configs/env';
import { EventIndexConfig, RegistryTransactionVersion } from '../../../../configs/types';
import { normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ContractEventRawData, RegistryTransactionData, ShareProviders } from '../../../../lib/types';
import IndexerHook from '../hook';

export interface CompoundAction {
  action: 'Supply' | 'Withdraw' | 'Borrow' | 'Repay';
  cTokenAddress: string; // cToken address
  cTokenAmount?: string;
  underlyingAmount: string;
  user: string;
  payer?: string;
  userBorrows?: string;
  totalBorrows?: string;
}
export interface CompoundTransactionData extends RegistryTransactionData {
  breakdown: {
    version: RegistryTransactionVersion;
    actions: Array<CompoundAction>;
  };
}

export class CompoundIndexerHook extends IndexerHook {
  public readonly name: string = 'hook.compound';

  constructor(protocol: string, providers: ShareProviders, configs: EventIndexConfig) {
    super(protocol, providers, configs);
  }

  private _transformEventToAction(event: ContractEventRawData): CompoundAction | undefined {
    switch (event.event) {
      case 'Mint': {
        return {
          action: 'Supply',
          cTokenAddress: normalizeAddress(event.contract),
          cTokenAmount: event.returnValues['mintTokens'],
          underlyingAmount: event.returnValues['mintAmount'],
          user: normalizeAddress(event.returnValues['minter']),
        };
      }
      case 'Redeem': {
        return {
          action: 'Withdraw',
          cTokenAddress: normalizeAddress(event.contract),
          cTokenAmount: event.returnValues['redeemTokens'],
          underlyingAmount: event.returnValues['redeemAmount'],
          user: normalizeAddress(event.returnValues['redeemer']),
        };
      }
      case 'Borrow': {
        return {
          action: 'Borrow',
          cTokenAddress: normalizeAddress(event.contract),
          underlyingAmount: event.returnValues['borrowAmount'],
          user: normalizeAddress(event.returnValues['borrower']),
          userBorrows: event.returnValues['accountBorrows'],
          totalBorrows: event.returnValues['totalBorrows'],
        };
      }
      case 'RepayBorrow': {
        return {
          action: 'Repay',
          cTokenAddress: normalizeAddress(event.contract),
          underlyingAmount: event.returnValues['repayAmount'],
          user: normalizeAddress(event.returnValues['borrower']),
          payer: normalizeAddress(event.returnValues['payer']),
          userBorrows: event.returnValues['accountBorrows'],
          totalBorrows: event.returnValues['totalBorrows'],
        };
      }
      default: {
        logger.onDebug({
          source: this.name,
          message: 'failed to transform event to action',
          props: {
            event: event.event,
            chain: event.chain,
            contract: event.contract,
          },
        });
      }
    }
  }

  public async processEvents(allEvents: Array<ContractEventRawData>): Promise<void> {
    const startExeTime = Math.floor(new Date().getTime() / 1000);

    const transactionRegistryCollection = await this.providers.database.getCollection(
      envConfig.database.collections.globalRegistryTransactions
    );

    // transactionHash => CompoundTransactionData
    const transactions: { [key: string]: CompoundTransactionData } = {};

    for (let eventIdx = 0; eventIdx < allEvents.length; eventIdx++) {
      const transactionHash = allEvents[eventIdx].transactionId.split(':')[0];
      const action: CompoundAction | undefined = this._transformEventToAction(allEvents[eventIdx]);
      if (action) {
        if (transactions[transactionHash]) {
          transactions[transactionHash].breakdown.actions.push(action);
        } else {
          transactions[transactionHash] = {
            transactionHash: transactionHash,
            chain: allEvents[eventIdx].chain,
            protocol: this.protocol,
            blockNumber: allEvents[eventIdx].blockNumber,
            timestamp: allEvents[eventIdx].timestamp,
            breakdown: {
              version: 'compound',
              actions: [action],
            },
          };
        }
      }
    }

    const operations: Array<any> = [];
    for (const [, transaction] of Object.entries(transactions)) {
      operations.push({
        updateOne: {
          filter: {
            chain: transaction.chain,
            protocol: transaction.protocol,
            transactionHash: transaction.transactionHash,
          },
          update: {
            $set: {
              ...transaction,
            },
          },
          upsert: true,
        },
      });
    }

    if (operations.length > 0) {
      await transactionRegistryCollection.bulkWrite(operations);
    }

    const endExeTime = Math.floor(new Date().getTime() / 1000);
    const elapsed = endExeTime - startExeTime;
    logger.onInfo({
      source: this.name,
      message: `hooked ${operations.length} transactions`,
      props: {
        protocol: this.protocol,
        elapsed: `${elapsed}s`,
      },
    });
  }
}
