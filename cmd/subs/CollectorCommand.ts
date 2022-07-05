import collectorModule from '../../modules/collector';
import { BasicCommand } from '../basic';

export class CollectorCommand extends BasicCommand {
  public readonly name: string = 'collector';
  public readonly describe: string = 'Run protocol collector service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    await collectorModule.run({
      providers,
      mode: argv.mode,
      protocol: argv.protocol,
      initialDate: argv.initialDate ? argv.initialDate : 0,
      forceSync: argv.force ? argv.force : false,
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      protocol: {
        type: 'string',
        default: '',
        describe: 'Run command with specify protocol name, ex: compound',
      },
      mode: {
        type: 'string',
        default: 'daily',
        describe: 'Run collector with daily or date mode',
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
