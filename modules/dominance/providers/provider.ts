import envConfig from '../../../core/env';
import { getTodayUTCTimestamp } from '../../../core/helper';
import logger from '../../../core/logger';
import { ShareProviders } from '../../../core/types';
import { InitialSyncDate } from '../constants';
import { CoinConfig, CoinDateData, IDominanceProvider, RunAggregatorProps } from '../types';

class DominanceProvider implements IDominanceProvider {
  public readonly name: string = 'dominance.provider';

  public config: CoinConfig;
  public providers: ShareProviders;
  constructor(coinConfig: CoinConfig, providers: ShareProviders) {
    this.config = coinConfig;
    this.providers = providers;
  }

  // override this function
  getDataInRange(fromTimestamp: number, toTimestamp: number): any {}

  public async runAggregator(props: RunAggregatorProps): Promise<void> {
    const { initialDate, forceSync } = props;

    const stateCollection = await this.providers.database.getCollection(envConfig.database.collections.globalState);
    const dateCollection = await this.providers.database.getCollection(envConfig.database.collections.globalDataDate);

    let startDate = initialDate === 0 ? InitialSyncDate : initialDate;
    if (!forceSync) {
      const states = await stateCollection
        .find({
          name: `dominance.states.${this.config.ticker}`,
        })
        .limit(1)
        .toArray();
      if (states.length > 0) {
        startDate = states[0].date;
      }
    }

    const today = getTodayUTCTimestamp();

    while (startDate <= today) {
      const toTimestamp = startDate + 365 * 24 * 60 * 60 > today ? today : startDate + 365 * 24 * 60 * 60;
      const data: Array<CoinDateData> = await this.getDataInRange(startDate, toTimestamp);
      const operations: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        operations.push({
          updateOne: {
            filter: {
              module: 'dominance',
              name: this.config.ticker,
              date: data[i].date,
            },
            update: {
              $set: {
                ...data[i],
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await dateCollection.bulkWrite(operations);
      }

      await stateCollection.updateOne(
        {
          name: `dominance.states.${this.config.ticker}`,
        },
        {
          $set: {
            date: toTimestamp,
          },
        },
        {
          upsert: true,
        }
      );

      logger.onInfo({
        source: this.name,
        message: 'updated dominance data',
        props: {
          ticker: this.config.ticker,
          fromDate: new Date(startDate * 1000).toISOString().split('T')[0],
          toDate: new Date(toTimestamp * 1000).toISOString().split('T')[0],
        },
      });

      startDate = startDate + 365 * 24 * 60 * 60;
    }
  }
}

export default DominanceProvider;
