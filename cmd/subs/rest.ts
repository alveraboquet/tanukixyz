import cors from 'cors';
import express from 'express';
import path from 'path';

import logger from '../../lib/logger';
import getRouter from '../../restapi';
import { BasicCommand } from '../basic';

export class Rest extends BasicCommand {
  public readonly name: string = 'rest';
  public readonly describe: string = 'Run restful API service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    const router = getRouter(providers);

    const port = process.env.PORT || argv.port || '8080';

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/v2', router);

    app.use('/', express.static(path.join('.', 'public')));

    app.listen(port, () => {
      logger.onInfo({
        source: 'rest.command',
        message: 'started rest API service',
        props: {
          address: `0.0.0.0:${port}`,
        },
      });
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      port: {
        type: 'number',
        default: 0,
        describe: 'The port number to listen',
      },
    });
  }
}
