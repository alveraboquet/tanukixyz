import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { getAdapter } from '../../providers';
import { DefiAdapter } from '../../providers/adapter';
import { BasicCommand } from '../basic';

export class Defiscan extends BasicCommand {
  public readonly name: string = 'defiscan';
  public readonly describe: string = 'Run defi protocol service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();

    const protocols: Array<string> = argv.protocols.split(',');

    while (true) {
      for (let i = 0; i < protocols.length; i++) {
        const adapter: DefiAdapter | null = getAdapter(protocols[i], providers);
        if (adapter === null) {
          logger.onWarn({
            source: 'adapter',
            message: `${protocols[i]} protocol adapter not found`,
            props: {},
          });
          continue;
        }

        const service = argv.service ? argv.service : '';
        switch (service) {
          case 'collector': {
            await adapter.startCollector({
              initialDate: Number(argv.initialDate),
              forceSync: argv.force ? argv.force : false,
            });
            break;
          }
          case 'indexer': {
            await adapter.startIndexer({
              initialDate: Number(argv.initialDate),
              forceSync: argv.force ? argv.force : false,
            });
            break;
          }
          default: {
            await adapter.start({
              initialDate: Number(argv.initialDate),
              forceSync: argv.force ? argv.force : false,
            });
          }
        }
      }

      await sleep(5 * 60);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      protocols: {
        type: 'string',
        default: '',
        describe: 'Run command with a list of protocol name - ex: compound, uniswap',
      },
      service: {
        type: 'string',
        default: '',
        describe: 'The service to run: indexer or collector, default both',
      },
      initialDate: {
        type: 'number',
        default: 0,
        describe: 'The initial date to start to sync data',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial date',
      },
    });
  }
}
