import { Router } from 'express';

import envConfig from '../../core/env';
import logger from '../../core/logger';
import { ShareProviders } from '../../core/types';
import { getCache, setCache } from '../caching';
import { removeIdFields, writeResponseData, writeResponseError } from '../helpers';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.get('/daily/:module', async (request, response) => {
    const module = request.params.module || 'unknown';

    // query cache
    const cacheKey = `${module}.daily.metrics`;
    const cacheData = getCache(cacheKey);
    if (cacheData) {
      writeResponseData(response, {
        status: 200,
        data: cacheData,
        removeIdField: false,
      });
      return;
    }

    const dailyMetricCollection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDaily
    );

    try {
      const documents: Array<any> = await dailyMetricCollection
        .find({
          module: module,
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
