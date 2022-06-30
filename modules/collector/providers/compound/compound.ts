import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { DefiProtocolModuleCode } from '../../../../configs';
import CompoundLendAbi from '../../../../configs/abi/compound/cToken.json';
import envConfig from '../../../../configs/env';
import { CompoundProtocolConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ProtocolDateData } from '../../types';
import CollectorProvider, { GetProtocolDateDataProps } from '../collector';
import { getPoolConfigByAddress } from './helpers';

class CompoundProvider extends CollectorProvider {
  public readonly name: string = 'provider.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  public async getDateData(props: GetProtocolDateDataProps): Promise<ProtocolDateData> {
    const { date, providers } = props;

    const dateData: ProtocolDateData = {
      module: DefiProtocolModuleCode,
      name: this.configs.name,
      date: date,

      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    for (let poolId = 0; poolId < this.configs.pools.length; poolId++) {
      const events = await eventCollection
        .find({
          contract: normalizeAddress(this.configs.pools[poolId].contractAddress),
          timestamp: {
            $gte: date,
            $lt: date + 24 * 60 * 60,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      const addresses: any = {};
      const transactions: any = {};
      const historyPrices: any = {};
      const poolConfig = getPoolConfigByAddress(this.configs.pools[poolId].contractAddress, this.configs.pools);
      if (!poolConfig) {
        logger.onDebug({
          source: this.name,
          message: 'pool config not found',
          props: {
            contract: normalizeAddress(this.configs.pools[poolId].contractAddress),
          },
        });
        continue;
      }
      if (events.length <= 0) continue;

      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );

      // get history price
      let historyPrice: number;
      if (historyPrices[poolConfig.underlying.coingeckoId]) {
        historyPrice = historyPrices[poolConfig.underlying.coingeckoId];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(poolConfig.underlying.coingeckoId, events[0].timestamp);
        historyPrices[poolConfig.underlying.coingeckoId] = historyPrice;
      }

      for (let i = 0; i < events.length; i++) {
        // count transaction
        if (!transactions[events[i].transactionId.split(':')[0]]) {
          dateData.transactionCount += 1;
          transactions[events[i].transactionId.split(':')[0]] = true;
        }

        // count user
        if (!addresses[normalizeAddress(events[i].returnValues['minter'])]) {
          dateData.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['minter'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['redeemer'])]) {
          dateData.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['redeemer'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['borrower'])]) {
          dateData.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['borrower'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['payer'])]) {
          dateData.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['payer'])] = true;
        }

        // count volume
        switch (events[i].event) {
          case 'Mint': {
            dateData.volumeInUseUSD += new BigNumber(events[i].returnValues.mintAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'Redeem': {
            dateData.volumeInUseUSD += new BigNumber(events[i].returnValues.redeemAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'Borrow': {
            dateData.volumeInUseUSD += new BigNumber(events[i].returnValues.borrowAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'RepayBorrow': {
            dateData.volumeInUseUSD += new BigNumber(events[i].returnValues.repayAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
          }
        }
      }

      try {
        // count liquidity
        const contract = new web3.eth.Contract(CompoundLendAbi as any, poolConfig.contractAddress);
        const totalCash = await contract.methods.getCash().call(events[0].blockNumber);
        const totalBorrows = await contract.methods.totalBorrows().call(events[0].blockNumber);
        const totalReserves = await contract.methods.totalReserves().call(events[0].blockNumber);
        const underlyingLiquidity = new BigNumber(totalCash.toString())
          .plus(new BigNumber(totalBorrows.toString()))
          .minus(new BigNumber(totalReserves.toString()))
          .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
          .toNumber();
        dateData.totalValueLockedUSD += underlyingLiquidity * historyPrice;
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'cannot query history tvl',
          props: {
            chain: poolConfig.chainConfig.name,
            contract: normalizeAddress(poolConfig.contractAddress),
            error: e.message,
          },
        });
      }
    }

    return dateData;
  }
}

export default CompoundProvider;
