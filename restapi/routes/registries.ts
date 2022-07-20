import { Router } from 'express';

import envConfig from '../../configs/env';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { writeResponseData, writeResponseError } from '../helpers';

const MaxRecordLimit = 100;

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.get('/address/:address', async (request, response) => {
    const address: string = String(request.params.address).toLowerCase();
    const chainQuery: string | null = request.query.chain ? String(request.query.chain) : null;

    const limit: number = request.query.limit
      ? Number(request.query.limit) > MaxRecordLimit
        ? MaxRecordLimit
        : Number(request.query.limit)
      : MaxRecordLimit;
    const skip: number = request.query.skip ? Number(request.query.skip) : 0;

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );

    try {
      const query = chainQuery
        ? {
            address: address,
            chain: chainQuery,
          }
        : {
            address: address,
          };

      const documents: Array<any> = await addressRegistryCollection
        .find(query)
        .sort({ address: 1 })
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
