import { YargsCommand } from '../core/namespaces';
import { ShareProviders } from '../core/types';
import { DatabaseProvider, GraphProvider, PolygonProvider } from '../providers';

export class BasicCommand implements YargsCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getProviders(): Promise<ShareProviders> {
    const providers: ShareProviders = {
      database: new DatabaseProvider(),
      subgraph: new GraphProvider(),
      polygon: new PolygonProvider(),
    };

    await providers.database.connect();

    return providers;
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
