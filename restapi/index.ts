import { Router } from 'express';

import { ShareProviders } from '../lib/types';
import * as metricRouter from './routes/metrics';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.use('/metrics', metricRouter.getRouter(providers));

  return router;
}

export default getRouter;
