import { Router } from 'express';

import { ShareProviders } from '../lib/types';
import * as metricRouter from './routes/metrics';
import * as registryRouter from './routes/registries';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.use('/metrics', metricRouter.getRouter(providers));
  router.use('/registries', registryRouter.getRouter(providers));

  return router;
}

export default getRouter;
