export interface Provider {
  name: string;
}

export interface IChainProvider extends Provider {
  // get the latest block number from node
  getLatestBlockNumber: () => Promise<number>;

  // query block info by number
  getBlockByNumber: (blockNumber: number) => Promise<any>;
}

export interface YargsCommand {
  name: string;
  describe: string;
  setOptions: (yargs: any) => void;
  execute: (argv: any) => void;
}

export interface IModuleService {
  runTester: (argv: any) => Promise<any>;
  runCollector: (argv: any) => Promise<any>;
  runAggregator: (argv: any) => Promise<any>;
}
