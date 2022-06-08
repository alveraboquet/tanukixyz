import { Router } from 'express';

import { ShareProviders } from '../core/types';
import * as metricRouter from './routes/metrics';

export function getRouter(providers: ShareProviders): Router {
  const router = Router({ mergeParams: true });

  router.use('/metrics', metricRouter.getRouter(providers));

  return router;
}

export default getRouter;
