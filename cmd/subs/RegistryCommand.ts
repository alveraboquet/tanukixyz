import registryModule from '../../modules/registry';
import { BasicCommand } from '../basic';

export class RegistryCommand extends BasicCommand {
  public readonly name: string = 'registry';
  public readonly describe: string = 'Run protocol registry service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    await registryModule.run({
      providers,
      protocol: argv.protocol,
      initialTime: argv.initialTime ? argv.initialTime : 0,
      forceSync: argv.force ? argv.force : false,
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      protocol: {
        type: 'string',
        default: '',
        describe: 'Run command with specify protocol name, ex: uniswap',
      },
      initialTime: {
        type: 'number',
        default: 0,
        describe: 'The initial time to start to sync data',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial time',
      },
    });
  }
}
