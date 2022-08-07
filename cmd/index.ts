import yargs from 'yargs/yargs';

import { Defiscan } from './subs/defiscan';
import { Rest } from './subs/rest';

(async function () {
  const restCmd = new Rest();
  const defiscanCmd = new Defiscan();

  yargs(process.argv.slice(2))
    .scriptName('tanukixyz')
    .command(restCmd.name, restCmd.describe, restCmd.setOptions, restCmd.execute)
    .command(defiscanCmd.name, defiscanCmd.describe, defiscanCmd.setOptions, defiscanCmd.execute)
    .help().argv;
})();
