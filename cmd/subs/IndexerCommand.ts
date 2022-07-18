import indexerModule from '../../modules/indexer';
import { BasicCommand } from '../basic';

export class IndexerCommand extends BasicCommand {
  public readonly name: string = 'indexer';
  public readonly describe: string = 'Run contract events index service';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const providers = await super.getProviders();
    await indexerModule.run({
      providers,
      protocol: argv.protocol,
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
      force: {
        type: 'boolean',
        default: false,
        describe: 'Force sync data from initial block',
      },
    });
  }
}
