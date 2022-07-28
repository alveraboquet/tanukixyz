import yargs from 'yargs/yargs';

import { BlockscanCommand } from './subs/blockscan';
import { Defiscan } from './subs/defiscan';
import { Rest } from './subs/rest';

(async function () {
  const restCmd = new Rest();
  const defiscanCmd = new Defiscan();
  const blockscanCmd = new BlockscanCommand();

  yargs(process.argv.slice(2))
    .scriptName('tanukixyz')
    .command(restCmd.name, restCmd.describe, restCmd.setOptions, restCmd.execute)
    .command(defiscanCmd.name, defiscanCmd.describe, defiscanCmd.setOptions, defiscanCmd.execute)
    .command(blockscanCmd.name, blockscanCmd.describe, blockscanCmd.setOptions, blockscanCmd.execute)
    .help().argv;
})();
