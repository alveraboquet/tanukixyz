import chainModule from '../../modules/blockchain';
import { BasicCommand } from '../basic';

export class ChainCommand extends BasicCommand {
  public readonly name: string = 'chain';
  public readonly describe: string = 'Run chain module services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const service = argv.service;
    switch (service) {
      case 'tester': {
        await chainModule.runTester({ project: argv.project });
        break;
      }
      case 'collector': {
        const providers = await super.getProviders();
        await chainModule.runCollector({
          providers,
          chain: argv.chain,
          initialBlock: argv.initialBlock,
          forceSync: argv.force,
        });
        break;
      }
      case 'aggregator': {
        const providers = await super.getProviders();
        await chainModule.runAggregator({
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
      initialBlock: {
        type: 'number',
        default: 0,
        describe: 'The initial block to start collector',
      },
      initialDate: {
        type: 'number',
        default: 0,
        describe: 'The initial date timestamp to start aggregator',
      },
      chain: {
        type: 'string',
        default: 'ethereum',
        describe: 'Chain to sync data, ex: ethereum',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial block',
      },
    });
  }
}
