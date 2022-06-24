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
      project: argv.project,
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      project: {
        type: 'string',
        default: '',
        describe: 'Run command with specify project name, ex: uniswap',
      },
    });
  }
}
