import { describe } from 'mocha';

import { CurveConfigs } from '../configs/protocols/curve';
import { DatabaseProvider, GraphProvider } from '../lib/providers';
import { ShareProviders } from '../lib/types';
import { EvmEventIndexer } from '../modules/indexer/evm';

let providers: ShareProviders;

describe('Indexer', async function () {
  beforeEach(async function () {
    providers = {
      database: new DatabaseProvider(),
      subgraph: new GraphProvider(),
    };

    await providers.database.connect();
  });

  it('curve', async function () {
    const indexer = new EvmEventIndexer(providers, CurveConfigs.pools);
    await indexer.test();
  });
});
