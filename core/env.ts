import dotenv from 'dotenv';

// global env and configurations
dotenv.config();

const envConfig = {
  database: {
    name: String(process.env.TANUKI_DATABASE_NAME),
    connectionUri: String(process.env.TANUKI_DATABASE_URL),
    collections: {
      // global collections
      globalState: 'tanukixyz.syncstate',
      globalDataDaily: 'tanukixyz.data.daily',
      globalDataDate: 'tanukixyz.data.date',

      blockchainBlockSync: 'tanukixyz.chain.blocks',
      lendingEventSync: 'tanukixyz.lending.events',
    },
  },
  apiKeys: {
    alchemy: String(process.env.TANUKI_ALCHEMY_API_KEY),
    getblock: String(process.env.TANUKI_GETBLOCK_API_KEY),
    moralis: String(process.env.TANUKI_MORALIS_API_KEY),
  },
  env: {
    timezone: String(process.env.TANUKI_TZ),
  },
};

export default envConfig;
