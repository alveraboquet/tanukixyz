import { DatabaseProvider, GraphProvider } from '../lib/providers';
import { ShareProviders } from '../lib/types';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getProviders(): Promise<ShareProviders> {
    const providers: ShareProviders = {
      database: new DatabaseProvider(),
      subgraph: new GraphProvider(),
    };

    await providers.database.connect();

    return providers;
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
