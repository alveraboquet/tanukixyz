import blockscanModule from '../../modules/blockscan';
import { BasicCommand } from '../basic';

export class BlockscanCommand extends BasicCommand {
  public readonly name: string = 'blockscan';
  public readonly describe: string = 'Run blockchain scanning service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    await blockscanModule.run({
      providers,
      chain: argv.chain,
      initialBlock: argv.initialBlock ? argv.initialBlock : 0,
      forceSync: argv.force ? argv.force : false,
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      chain: {
        type: 'string',
        default: '',
        describe: 'Run blockscan with given blockchain, ex: ethereum',
      },
      initialBlock: {
        type: 'number',
        default: 0,
        describe: 'The initial block to start to sync data',
      },
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial block',
      },
    });
  }
}
