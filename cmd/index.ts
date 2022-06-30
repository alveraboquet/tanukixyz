import yargs from 'yargs/yargs';

import { BlockscanCommand } from './subs/BlockscanCommand';
import { CollectorCommand } from './subs/CollectorCommand';
import { IndexerCommand } from './subs/IndexerCommand';
import { RestCommand } from './subs/RestCommand';

(async function () {
  const restCmd = new RestCommand();
  const indexerCmd = new IndexerCommand();
  const collectorCmd = new CollectorCommand();
  const blockscanCmd = new BlockscanCommand();

  yargs(process.argv.slice(2))
    .scriptName('tanukixyz')
    .command(restCmd.name, restCmd.describe, restCmd.setOptions, restCmd.execute)
    .command(indexerCmd.name, indexerCmd.describe, indexerCmd.setOptions, indexerCmd.execute)
    .command(collectorCmd.name, collectorCmd.describe, collectorCmd.setOptions, collectorCmd.execute)
    .command(blockscanCmd.name, blockscanCmd.describe, blockscanCmd.setOptions, blockscanCmd.execute)
    .help().argv;
})();
