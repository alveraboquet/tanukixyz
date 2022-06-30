import { Router } from 'express';

import envConfig from '../../configs/env';
import { getTodayUTCTimestamp } from '../../lib/helper';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
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

  router.get('/date/:module', async (request, response) => {
    const module = request.params.module || 'unknown';

    let toDate = getTodayUTCTimestamp();
    let fromDate = toDate - 7 * 24 * 60 * 60; // last 7 days

    // fromDate and toDate format: 2022-11-30
    if (request.query['fromDate']) {
      fromDate = Math.floor(new Date(request.query['fromDate'].toString()).getTime() / 1000);
    }
    if (request.query['toDate']) {
      toDate = Math.floor(new Date(request.query['toDate'].toString()).getTime() / 1000);
    }

    const dateMetricCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    try {
      const documents: Array<any> = await dateMetricCollection
        .find({
          module: module,
          date: {
            $gte: fromDate,
            $lte: toDate,
          },
        })
        .sort({ date: -1 })
        .toArray();
      writeResponseData(response, {
        status: 200,
        data: documents,
        removeIdField: true,
      });
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
