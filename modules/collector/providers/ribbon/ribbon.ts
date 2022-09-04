import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import envConfig from '../../../../configs/env';
import { RibbonProtocolConfig } from '../../../../configs/protocols/ribbon';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolTokenData } from '../../types';
import { queryVaultTransactions, queryVaults } from './helpers';

export class RibbonProvider extends CollectorProvider {
  public readonly name: string = 'collector.ribbon';

  constructor(configs: RibbonProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    return await this.getDataBySubgraphs(providers, fromTime, toTime);
  }

  public async getDataByEvents(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      feeUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,

      detail: {
        tokens: [],
      },
    };

    const configs: RibbonProtocolConfig = this.configs;
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};
    const tokens: { [key: string]: ProtocolTokenData } = {};

    for (const vault of configs.vaults) {
      const events = await eventCollection
        .find({
          chain: vault.chainConfig.name,
          contract: normalizeAddress(vault.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      // init token
      const tokenAddress: string = normalizeAddress(vault.asset.chains[vault.chainConfig.name].address);
      const tokenDecimals: number = vault.asset.chains[vault.chainConfig.name].decimals;
      tokens[vault.asset.symbol] = {
        chain: vault.chainConfig.name,
        symbol: vault.asset.symbol,
        decimals: tokenDecimals,
        address: tokenAddress,

        volumeInUseUSD: 0,
        totalValueLockedUSD: 0,
        transactionCount: 0,
      };

      for (const event of events) {
        if (!!transactions[event.transactionId.split(':')[0]]) {
          data.transactionCount += 1;
          transactions[event.transactionId.split(':')[0]] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues.account)]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues.account)] = true;
        }

        // get history price
        let historyPrice: number;
        if (historyPrices[vault.asset.coingeckoId]) {
          historyPrice = historyPrices[vault.asset.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(vault.asset.coingeckoId, fromTime);
          historyPrices[vault.asset.coingeckoId] = historyPrice;
        }

        const volume = new BigNumber(event.returnValues.amount)
          .dividedBy(new BigNumber(10).pow(tokenDecimals))
          .multipliedBy(historyPrice)
          .toNumber();
        data.volumeInUseUSD += volume;
        tokens[vault.asset.symbol].volumeInUseUSD += volume;

        // count liquidity
        const blockAtTimestamp = await providers.subgraph.queryBlockAtTimestamp(
          vault.chainConfig.subgraph?.blockSubgraph as string,
          toTime
        );

        const web3 = new Web3(
          vault.chainConfig.nodeRpcs.archive ? vault.chainConfig.nodeRpcs.archive : vault.chainConfig.nodeRpcs.default
        );
        const vaultContract = new web3.eth.Contract(vault.contractAbi, vault.contractAddress);
        const totalBalance = await vaultContract.methods.totalBalance().call(blockAtTimestamp);
        const liquidity = new BigNumber(totalBalance.toString())
          .dividedBy(new BigNumber(10).pow(tokenDecimals))
          .toNumber();

        data.totalValueLockedUSD += liquidity;
        tokens[vault.asset.symbol].totalValueLockedUSD += liquidity;
      }
    }

    if (data.detail) {
      for (const [, token] of Object.entries(tokens)) {
        data.detail.tokens.push(token);
      }
    }

    return data;
  }

  public async getDataBySubgraphs(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      feeUSD: 0,
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

    // count total value locked
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
