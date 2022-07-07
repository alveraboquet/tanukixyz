import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import CompoundLendAbi from '../../../../configs/abi/compound/cToken.json';
import envConfig from '../../../../configs/env';
import { CompoundProtocolConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import CollectorProvider, { GetProtocolDataProps } from '../collector';
import { getPoolConfigByAddress } from './helpers';

class CompoundProvider extends CollectorProvider {
  public readonly name: string = 'provider.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  private async getDataInRange(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
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
            $gte: fromTime,
            $lt: toTime,
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
          data.transactionCount += 1;
          transactions[events[i].transactionId.split(':')[0]] = true;
        }

        // count user
        if (!addresses[normalizeAddress(events[i].returnValues['minter'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['minter'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['redeemer'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['redeemer'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['borrower'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['borrower'])] = true;
        }
        if (!addresses[normalizeAddress(events[i].returnValues['payer'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(events[i].returnValues['payer'])] = true;
        }

        // count volume
        switch (events[i].event) {
          case 'Mint': {
            data.volumeInUseUSD += new BigNumber(events[i].returnValues.mintAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'Redeem': {
            data.volumeInUseUSD += new BigNumber(events[i].returnValues.redeemAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'Borrow': {
            data.volumeInUseUSD += new BigNumber(events[i].returnValues.borrowAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            break;
          }
          case 'RepayBorrow': {
            data.volumeInUseUSD += new BigNumber(events[i].returnValues.repayAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();

            try {
              // count revenue = totalBorrowAfterWithRepay - totalBorrowBeforeRepay
              const contract = new web3.eth.Contract(CompoundLendAbi as any, poolConfig.contractAddress);
              const totalBorrows = await contract.methods.totalBorrows().call(events[i].blockNumber - 1);
              const multiplier = new BigNumber(10).pow(
                poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals
              );
              const borrowBefore = new BigNumber(totalBorrows.toString()).dividedBy(multiplier).toNumber();
              const borrowAfter = new BigNumber(events[i].returnValues.totalBorrows).dividedBy(multiplier).toNumber();
              const repayAmount = new BigNumber(events[i].returnValues.repayAmount).dividedBy(multiplier).toNumber();
              data.revenueUSD +=
                repayAmount + borrowAfter > borrowBefore ? repayAmount + borrowAfter - borrowBefore : 0;
            } catch (e: any) {
              logger.onDebug({
                source: this.name,
                message: 'cannot query history data',
                props: {
                  chain: poolConfig.chainConfig.name,
                  contract: normalizeAddress(poolConfig.contractAddress),
                  error: e.message,
                },
              });
            }
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
        data.totalValueLockedUSD += underlyingLiquidity * historyPrice;
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

    return data;
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { date, providers } = props;
    return await this.getDataInRange(providers, date, date + 24 * 60 * 60);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    const { date, providers } = props;
    return await this.getDataInRange(providers, date - 24 * 60 * 60, date);
  }
}

export default CompoundProvider;
