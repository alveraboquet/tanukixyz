import yargs from 'yargs/yargs';

import { ChainCommand } from './subs/ChainCommand';
import { DexCommand } from './subs/DexCommand';
import { DominanceCommand } from './subs/DominanceCommand';
import { LendingCommand } from './subs/LendingCommand';
import { RestCommand } from './subs/RestCommand';

(async function () {
  const chainCmd = new ChainCommand();
  const dexCmd = new DexCommand();
  const restCmd = new RestCommand();
  const lendingCmd = new LendingCommand();
  const dominanceCmd = new DominanceCommand();

  yargs(process.argv.slice(2))
    .scriptName('tanukixyz')
    .command(restCmd.name, restCmd.describe, restCmd.setOptions, restCmd.execute)
    .command(chainCmd.name, chainCmd.describe, chainCmd.setOptions, chainCmd.execute)
    .command(dexCmd.name, dexCmd.describe, dexCmd.setOptions, dexCmd.execute)
    .command(lendingCmd.name, lendingCmd.describe, lendingCmd.setOptions, lendingCmd.execute)
    .command(dominanceCmd.name, dominanceCmd.describe, dominanceCmd.setOptions, dominanceCmd.execute)
    .help().argv;
})();
