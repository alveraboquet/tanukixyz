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
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      protocol: {
        type: 'string',
        default: '',
        describe: 'Run command with specify protocol name, ex: uniswap',
      },
    });
  }
}
