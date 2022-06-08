import dexModule from '../../modules/dex';
import { BasicCommand } from '../basic';

export class DexCommand extends BasicCommand {
  public readonly name: string = 'dex';
  public readonly describe: string = 'Run dex module services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const service = argv.service;
    switch (service) {
      case 'tester': {
        await dexModule.runTester({ project: argv.project });
        break;
      }
      case 'aggregator': {
        const providers = await super.getProviders();
        await dexModule.runAggregator({
          providers,
          project: argv.project,
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
        describe: 'The initial date to start to sync data',
      },
      project: {
        type: 'string',
        default: '',
        describe: 'Run command with specify project name, ex: uniswap',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial initial date',
      },
    });
  }
}
