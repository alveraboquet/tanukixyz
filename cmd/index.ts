import yargs from 'yargs/yargs';

import { ChainCommand } from './subs/ChainCommand';
import { DefiCommand } from './subs/DefiCommand';
import { DexCommand } from './subs/DexCommand';
import { IndexerCommand } from './subs/IndexerCommand';
import { LendingCommand } from './subs/LendingCommand';
import { RestCommand } from './subs/RestCommand';

(async function () {
  const chainCmd = new ChainCommand();
  const dexCmd = new DexCommand();
  const restCmd = new RestCommand();
  const lendingCmd = new LendingCommand();
  const indexerCmd = new IndexerCommand();
  const defiCmd = new DefiCommand();

  yargs(process.argv.slice(2))
    .scriptName('tanukixyz')
    .command(restCmd.name, restCmd.describe, restCmd.setOptions, restCmd.execute)
    .command(chainCmd.name, chainCmd.describe, chainCmd.setOptions, chainCmd.execute)
    .command(dexCmd.name, dexCmd.describe, dexCmd.setOptions, dexCmd.execute)
    .command(lendingCmd.name, lendingCmd.describe, lendingCmd.setOptions, lendingCmd.execute)
    .command(indexerCmd.name, indexerCmd.describe, indexerCmd.setOptions, indexerCmd.execute)
    .command(defiCmd.name, defiCmd.describe, defiCmd.setOptions, defiCmd.execute)
    .help().argv;
})();
