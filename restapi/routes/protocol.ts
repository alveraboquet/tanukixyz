import { Router } from 'express';

import envConfig from '../../configs/env';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { getCache, setCache } from '../caching';
import { removeIdFields, writeResponseData, writeResponseError } from '../helpers';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.get('/:protocol', async (request, response) => {
    const protocol = request.params.protocol || '';

    // query cache
    const cacheKey = `${protocol}.data`;
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
    const dateMetricCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    try {
      const data: any = {};

      const dailyData: Array<any> = await dailyMetricCollection
        .find({
          module: 'defi',
          name: protocol,
        })
        .toArray();

      if (dailyData.length > 0) {
        data.daily = dailyData[0];
      } else {
        data.daily = null;
      }

      const dateData: Array<any> = await dateMetricCollection
        .find({
          module: 'defi',
          name: protocol,
        })
        .toArray();

      data.date = removeIdFields(dateData);

      writeResponseData(response, {
        status: 200,
        data: data,
        removeIdField: false,
      });

      // set caching
      setCache(cacheKey, removeIdFields(data));
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
