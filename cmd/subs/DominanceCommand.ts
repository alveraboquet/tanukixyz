import dominanceModule from '../../modules/dominance';
import { BasicCommand } from '../basic';

export class DominanceCommand extends BasicCommand {
  public readonly name: string = 'dominance';
  public readonly describe: string = 'Run dominance module services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const service = argv.service;
    switch (service) {
      case 'aggregator': {
        const providers = await super.getProviders();
        await dominanceModule.runAggregator({
          providers,
          initialDate: argv.initialDate,
          forceSync: argv.force,
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
      initialDate: {
        type: 'number',
        default: 0,
        describe: 'The initial date timestamp to start aggregator',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial block',
      },
    });
  }
}
