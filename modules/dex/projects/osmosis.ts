import { AggregatorArgv, DexConfig, DexDateData, IDexProvider } from '../types';

const API_ENDPOINTS = {
  metrics: 'https://api-osmosis.imperator.co/overview/v1/metrics',
  volume: 'https://api-osmosis.imperator.co/volume/v2/historical/chart',
  liquidity: 'https://api-osmosis.imperator.co/liquidity/v2/historical/chart',
};

export class OsmosisProvider implements IDexProvider {
  public readonly name: string = 'osmosis.provider';
  public readonly config: DexConfig;

  constructor(config: DexConfig) {
    this.config = config;
  }

  public async getDailyData(): Promise<void> {}

  getDateData(date: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async runAggregator(argv: AggregatorArgv): Promise<void> {}

  public async runTest(): Promise<void> {}
}
