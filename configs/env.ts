import dotenv from 'dotenv';

import { EnvConfig } from './types';

// global env and configurations
dotenv.config();

const envConfig: EnvConfig = {
  database: {
    name: String(process.env.TANUKI_DATABASE_NAME),
    connectionUri: String(process.env.TANUKI_DATABASE_URL),
    collections: {
      // global collections
      globalState: 'tanukixyz.syncstate',
      globalDataDaily: 'tanukixyz.data.daily',
      globalDataDate: 'tanukixyz.data.date',
      globalContractEvents: 'tanukixyz.contract.events',
      globalBlockscanBlocks: 'tanukixyz.chain.blocks',
      globalRegistryAddresses: 'tanukixyz.registry.addresses',
      globalRegistryAddressSnapshot: 'tanukixyz.registry.address.snapshots',
      globalRegistryTransactions: 'tanukixyz.registry.transactions',
    },
  },
  apiKeys: {
    alchemy: String(process.env.TANUKI_ALCHEMY_API_KEY),
    getblock: String(process.env.TANUKI_GETBLOCK_API_KEY),
  },
  env: {
    timezone: String(process.env.TANUKI_TZ),
  },
};

export default envConfig;
