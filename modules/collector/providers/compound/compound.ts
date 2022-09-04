import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import CompoundPriceOracle from '../../../../configs/abi/compound/PriceOracle.json';
import CompoundLendAbi from '../../../../configs/abi/compound/cToken.json';
import envConfig from '../../../../configs/env';
import { CompoundProtocolConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolLendingActionData, ProtocolTokenData } from '../../types';

export class CompoundProvider extends CollectorProvider {
  public readonly name: string = 'collector.compound';

  constructor(configs: CompoundProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
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

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};
    const actions: ProtocolLendingActionData = {
      supplyVolumeUSD: 0,
      withdrawVolumeUSD: 0,
      borrowVolumeUSD: 0,
      repayVolumeUSD: 0,
      liquidateVolumeUSD: 0,
    };

    for (const poolConfig of this.configs.pools) {
      const underlyingAddress = normalizeAddress(poolConfig.underlying.chains[poolConfig.chainConfig.name].address);
      const tokenData: ProtocolTokenData = {
        chain: poolConfig.chainConfig.name,
        symbol: poolConfig.underlying.symbol,
        address: underlyingAddress,
        decimals: poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals,

        volumeInUseUSD: 0,
        totalValueLockedUSD: 0,
        transactionCount: 0,
      };

      const events = await eventCollection
        .find({
          contract: normalizeAddress(poolConfig.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      const web3 = new Web3(
        poolConfig.chainConfig.nodeRpcs.archive
          ? poolConfig.chainConfig.nodeRpcs.archive
          : poolConfig.chainConfig.nodeRpcs.default
      );

      // get history price
      let historyPrice: number;
      if (!poolConfig.underlyingOracle) {
        if (historyPrices[poolConfig.underlying.coingeckoId]) {
          historyPrice = historyPrices[poolConfig.underlying.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(poolConfig.underlying.coingeckoId, fromTime);
          historyPrices[poolConfig.underlying.coingeckoId] = historyPrice;
        }
      } else {
        // get price from on-chain oracle
        const oracleContract = new web3.eth.Contract(CompoundPriceOracle as any, poolConfig.underlyingOracle);
        const underlyingPrice = await oracleContract.methods.getUnderlyingPrice(poolConfig.contractAddress).call();
        historyPrice = new BigNumber(underlyingPrice.toString()).dividedBy(1e18).toNumber();
      }

      for (const event of events) {
        // count transaction
        if (!transactions[event.transactionId.split(':')[0]]) {
          tokenData.transactionCount += 1;
          data.transactionCount += 1;
          transactions[event.transactionId.split(':')[0]] = true;
        }

        // count user
        if (!addresses[normalizeAddress(event.returnValues['minter'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['minter'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['redeemer'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['redeemer'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['borrower'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['borrower'])] = true;
        }
        if (!addresses[normalizeAddress(event.returnValues['payer'])]) {
          data.userCount += 1;
          addresses[normalizeAddress(event.returnValues['payer'])] = true;
        }

        // count volume
        let volume = 0;
        switch (event.event) {
          case 'Mint': {
            volume = new BigNumber(event.returnValues.mintAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            actions.supplyVolumeUSD += volume;
            break;
          }
          case 'Redeem': {
            volume = new BigNumber(event.returnValues.redeemAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            actions.withdrawVolumeUSD += volume;
            break;
          }
          case 'Borrow': {
            volume = new BigNumber(event.returnValues.borrowAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            actions.borrowVolumeUSD += volume;
            break;
          }
          case 'RepayBorrow': {
            volume = new BigNumber(event.returnValues.repayAmount)
              .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
              .multipliedBy(historyPrice)
              .toNumber();
            actions.repayVolumeUSD += volume;
            break;
          }
        }

        data.volumeInUseUSD += volume;
        tokenData.volumeInUseUSD += volume;
      }

      try {
        // count liquidity
        const contract = new web3.eth.Contract(CompoundLendAbi as any, poolConfig.contractAddress);
        const totalCash = await contract.methods.getCash().call();
        const totalBorrows = await contract.methods.totalBorrows().call();
        const totalReserves = await contract.methods.totalReserves().call();
        const underlyingLiquidity = new BigNumber(totalCash.toString())
          .plus(new BigNumber(totalBorrows.toString()))
          .minus(new BigNumber(totalReserves.toString()))
          .dividedBy(new BigNumber(10).pow(poolConfig.underlying.chains[poolConfig.chainConfig.name].decimals))
          .toNumber();
        data.totalValueLockedUSD += underlyingLiquidity * historyPrice;
        tokenData.totalValueLockedUSD += underlyingLiquidity * historyPrice;
      } catch (e: any) {
        logger.onDebug({
          source: this.name,
          message: 'cannot query pool liquidity',
          props: {
            chain: poolConfig.chainConfig.name,
            contract: normalizeAddress(poolConfig.contractAddress),
            error: e.message,
          },
        });
      }

      data.detail?.tokens.push(tokenData);
    }

    if (data.detail) {
      data.detail.actions = actions;
    }

    return data;
  }
}
