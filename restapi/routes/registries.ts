import { Router } from 'express';

import envConfig from '../../configs/env';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { writeResponseData, writeResponseError } from '../helpers';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.get('/tx', async (request, response) => {
    const protocolQuery: string | null = request.query.protocol ? String(request.query.protocol) : null;
    const chainQuery: string | null = request.query.chain ? String(request.query.chain) : null;

    const limit: number = request.query.limit ? Number(request.query.limit) : 100;
    const skip: number = request.query.skip ? Number(request.query.skip) : 0;
    const sort: string = request.query.sort ? String(request.query.sort) : 'latest';

    const transactionRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryTransactions
    );

    try {
      let query: any = protocolQuery ? { protocol: protocolQuery } : {};
      query = chainQuery
        ? {
            ...query,
            chain: chainQuery,
          }
        : query;

      const documents: Array<any> = await transactionRegistryCollection
        .find(query)
        .sort({ timestamp: sort === 'oldest' ? 1 : -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
      writeResponseData(response, {
        status: 200,
        data: documents,
        removeIdField: true,
      });
    } catch (e: any) {
      logger.onError({
        source: 'router.registries',
        message: 'failed to serve api request',
        props: {
          path: request.path,
          error: e.message,
        },
        error: e as Error,
      });
      writeResponseError(response, {
        status: 500,
        error: e.message,
      });
    }
  });

  return router;
}
