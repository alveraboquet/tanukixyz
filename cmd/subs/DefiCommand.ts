import defiModule from '../../modules/defi';
import { BasicCommand } from '../basic';

export class DefiCommand extends BasicCommand {
  public readonly name: string = 'defi';
  public readonly describe: string = 'Run defi collector service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    await defiModule.run({
      providers,
      project: argv.project,
      initialDate: argv.initialDate ? argv.initialDate : 0,
      forceSync: argv.force ? argv.force : false,
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      project: {
        type: 'string',
        default: '',
        describe: 'Run command with specify project name, ex: compound',
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
