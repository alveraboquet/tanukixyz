import lendingModule from '../../modules/lending';
import { BasicCommand } from '../basic';

export class LendingCommand extends BasicCommand {
  public readonly name: string = 'lending';
  public readonly describe: string = 'Run lending module services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const service = argv.service;
    switch (service) {
      case 'collector': {
        const providers = await super.getProviders();
        await lendingModule.runCollector({
          providers,
          project: argv.project,
        });
        break;
      }
      case 'aggregator': {
        const providers = await super.getProviders();
        await lendingModule.runAggregator({
          providers,
          project: argv.project,
          initialDate: argv.initialDate,
          forceSync: argv.force ? argv.force : false,
        });
        break;
      }
      default: {
        console.info(`Unsupported service ${service}`);
        process.exit(0);
      }
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      service: {
        type: 'string',
        default: 'tester',
        describe: 'The service to run: tester, aggregator',
      },
      project: {
        type: 'string',
        default: '',
        describe: 'Run with a specify project',
      },
      initialDate: {
        type: 'number',
        default: 0,
        describe: 'The initial date to start to sync data',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial initial date',
      },
    });
  }
}
