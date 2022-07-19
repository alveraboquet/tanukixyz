import BigNumber from 'bignumber.js';

import { RibbonProtocolConfig } from '../../../../configs/protocols/ribbon';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import CollectorProvider from '../collector';
import { CollectorHook } from '../hook';
import { queryVaultTransactions, queryVaults } from './helpers';

export class RibbonProvider extends CollectorProvider {
  public readonly name: string = 'provider.ribbon';

  constructor(configs: RibbonProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: RibbonProtocolConfig = this.configs;

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};

    const vaultTransactions: Array<any> = await queryVaultTransactions(configs, providers, fromTime, toTime);

    for (let i = 0; i < vaultTransactions.length; i++) {
      const transactionId = vaultTransactions[i].txhash;
      const address = normalizeAddress(vaultTransactions[i].address);
      if (!transactions[transactionId]) {
        data.transactionCount += 1;
        transactions[transactionId] = true;
      }
      if (!addresses[address]) {
        data.userCount += 1;
        addresses[address] = true;
      }

      // get history price
      let historyPrice: number;
      if (historyPrices[vaultTransactions[i].assetToken.coingeckoId]) {
        historyPrice = historyPrices[vaultTransactions[i].assetToken.coingeckoId];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(vaultTransactions[i].assetToken.coingeckoId, fromTime);
        historyPrices[vaultTransactions[i].assetToken.coingeckoId] = historyPrice;
      }

      const volume = new BigNumber(vaultTransactions[i].underlyingAmount)
        .dividedBy(new BigNumber(10).pow(vaultTransactions[i].vault.underlyingDecimals))
        .multipliedBy(historyPrice)
        .toNumber();
      data.volumeInUseUSD += volume;
    }

    // count total valur locked
    const vaults: Array<any> = await queryVaults(configs, providers);
    for (let i = 0; i < vaults.length; i++) {
      // get history price
      let historyPrice: number;
      if (historyPrices[vaults[i].assetToken.coingeckoId]) {
        historyPrice = historyPrices[vaults[i].assetToken.coingeckoId];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(vaults[i].assetToken.coingeckoId, fromTime);
        historyPrices[vaults[i].assetToken.coingeckoId] = historyPrice;
      }

      data.totalValueLockedUSD += new BigNumber(vaults[i].totalBalance)
        .dividedBy(new BigNumber(10).pow(vaults[i].underlyingDecimals))
        .multipliedBy(historyPrice)
        .toNumber();
    }

    return data;
  }
}
