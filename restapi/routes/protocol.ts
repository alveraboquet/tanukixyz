import { Router } from 'express';

import envConfig from '../../configs/env';
import logger from '../../lib/logger';
import { ShareProviders } from '../../lib/types';
import { writeResponseData, writeResponseError } from '../helpers';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  // get protocol summarize data
  router.get('/:protocol/summarize', async (request, response) => {
    const protocol = request.params.protocol || null;

    if (!protocol) {
      writeResponseError(response, {
        status: 404,
        error: 'protocol not found',
      });
      return;
    }

    const dailyMetricCollection = await providers.database.getCollection(
      envConfig.database.collections.globalDataDaily
    );

    try {
      const dailyData: Array<any> = await dailyMetricCollection
        .find({
          module: 'defi',
          name: protocol,
        })
        .toArray();

      if (dailyData.length > 0) {
        delete dailyData[0]._id;
      }

      writeResponseData(response, {
        status: 200,
        data: dailyData[0],
        removeIdField: false,
      });
    } catch (e: any) {
      logger.onError({
        source: 'router.protocol',
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

  // get protocol date data
  router.get('/:protocol/datedata', async (request, response) => {
    const protocol = request.params.protocol || null;

    if (!protocol) {
      writeResponseError(response, {
        status: 404,
        error: 'protocol not found',
      });
      return;
    }

    const dateMetricCollection = await providers.database.getCollection(envConfig.database.collections.globalDataDate);

    try {
      const dateData: Array<any> = await dateMetricCollection
        .find({
          module: 'defi',
          name: protocol,
        })
        .sort({ date: -1 })
        .toArray();

      for (let i = 0; i < dateData.length; i++) {
        if (dateData[i].detail && dateData[i].detail.tokens) {
          delete dateData[i].detail.tokens;
        }
      }

      writeResponseData(response, {
        status: 200,
        data: dateData,
        removeIdField: true,
      });
      return;
    } catch (e: any) {
      logger.onError({
        source: 'router.protocol',
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
