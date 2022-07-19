import { CompoundProtocolConfig } from '../../../configs/types';
import { getNativeTokenPrice, normalizeAddress } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { CollectorHook, GetHookDataProps } from '../providers/hook';

export interface CompoundHookData {
  badDebtUSD: number;
  insolventUserCount: number;
}

export class CompoundCollectorHook extends CollectorHook {
  public readonly name: string = 'hook.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  public async getHookData(props: GetHookDataProps): Promise<CompoundHookData> {
    logger.onInfo({
      source: this.name,
      message: 'calling hook, query bad debts and insolvent accounts',
      props: {
        name: this.configs.name,
      },
    });

    const { providers, date } = props;

    const data: CompoundHookData = {
      badDebtUSD: 0,
      insolventUserCount: 0,
    };

    // count bad debts metrics
    const configs: CompoundProtocolConfig = this.configs as CompoundProtocolConfig;
    if (configs.subgraphs) {
      const addresses: any = {};

      for (let i = 0; i < this.configs.subgraphs.length; i++) {
        let debtsETH = 0;
        try {
          let startID = '0';
          while (true) {
            const query = `
              {
                accounts: accounts(first: 1000, where: {hasBorrowed: true, id_gt: "${startID}"}, orderBy: id, orderDirection: asc) {
                  id
                  totalBorrowValueInEth
                  totalCollateralValueInEth
                }
              }
            `;
            const response = await providers.subgraph.querySubgraph(this.configs.subgraphs[i].lending, query);
            const accounts: Array<any> = response && response['accounts'] ? response['accounts'] : [];

            for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
              const collateral: number = Number(accounts[accountIdx].totalCollateralValueInEth);
              const borrow: number = Number(accounts[accountIdx].totalBorrowValueInEth);
              const isBadDebt = collateral < borrow;
              debtsETH += isBadDebt ? borrow - collateral : 0;

              if (isBadDebt && !addresses[normalizeAddress(accounts[accountIdx].id)]) {
                data.insolventUserCount += 1;
                addresses[normalizeAddress(accounts[accountIdx].id)] = true;
              }
            }

            if (accounts.length > 0) {
              startID = accounts[accounts.length - 1].id;
            } else {
              break;
            }
          }

          const coinPrice: number = await getNativeTokenPrice(this.configs.subgraphs[i].chainConfig.name, date);
          data.badDebtUSD += debtsETH * coinPrice;
        } catch (e: any) {
          logger.onDebug({
            source: this.name,
            message: 'cannot query debts data',
            props: {
              protocol: this.configs.name,
              subgraph: this.configs.subgraphs[i].lending,
              error: e.message,
            },
          });
        }
      }
    }

    return data;
  }
}
