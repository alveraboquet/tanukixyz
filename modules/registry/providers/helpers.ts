import envConfig from '../../../configs/env';
import { RegistryTransactionData, ShareProviders } from '../../../lib/types';

export async function getTransactionFromDatabase(
  providers: ShareProviders,
  chain: string,
  transactionHash: string
): Promise<RegistryTransactionData | null> {
  const transactionRegistryCollection = await providers.database.getCollection(
    envConfig.database.collections.globalRegistryTransactions
  );
  const savedTransactions = await transactionRegistryCollection
    .find({
      chain: chain,
      transactionHash: transactionHash,
    })
    .limit(1)
    .toArray();

  if (savedTransactions.length > 0) {
    const transaction = savedTransactions[0];
    return {
      protocol: transaction.protocol,
      chain: transaction.chain,
      blockNumber: transaction.blockNumber,
      timestamp: transaction.timestamp,
      transactionHash: transaction.transactionHash,
    };
  }

  return null;
}
