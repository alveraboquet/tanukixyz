import { Router } from 'express';

import envConfig from '../../configs/env';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { getCache, setCache } from '../caching';
import { removeIdFields, writeResponseData, writeResponseError } from '../helpers';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  // daily endpoint doesn't return full data
  router.get('/date/:protocol', async (request, response) => {
    const protocol = request.params.protocol || '';

    // query cache
    const cacheKey = `${protocol}.date.metrics`;
    const cacheData = getCache(cacheKey);
    if (cacheData) {
      writeResponseData(response, {
        status: 200,
        data: cacheData,
        removeIdField: false,
      });
      return;
    }

    const dateMetricCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    try {
      const documents: Array<any> = await dateMetricCollection
        .find({
          module: 'defi',
          name: protocol,
        })
        .toArray();

      writeResponseData(response, {
        status: 200,
        data: documents,
        removeIdField: true,
      });

      // set caching
      setCache(cacheKey, removeIdFields(documents));
    } catch (e: any) {
      logger.onError({
        source: 'router.metrics',
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
