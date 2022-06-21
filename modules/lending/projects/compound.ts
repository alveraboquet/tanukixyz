import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../core/helper';
import { ChainConfig } from '../../../core/types';
import { getCoingeckoId } from '../helpers';
import { LendingConfig, LendingData, LendingPool } from '../types';
import LendingProvider from './lending';

interface CompoundGetPoolEventsProps {
  chainConfig: ChainConfig;
  poolConfig: LendingPool;
  fromBlock: number;
  toBlock: number;
}

interface CompoundGetPoolLiquidity {
  chainConfig: ChainConfig;
  poolConfig: LendingPool;
  blockNumber: number;
  blockTime: number;
}

class CompoundProvider extends LendingProvider {
  public readonly name: string = 'compound.provider';

  constructor(lendingConfig: LendingConfig) {
    super(lendingConfig);
  }

  // compound liquidity = getCash + totalBorrows - totalReserves
  public async getLiquidityLocked(props: CompoundGetPoolLiquidity): Promise<number> {
    const { chainConfig, poolConfig, blockNumber, blockTime } = props;

    const web3 = new Web3(chainConfig.nodeRpcs.archive ? chainConfig.nodeRpcs.archive : chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(poolConfig.abi, poolConfig.poolAddress);

    const totalCash = await contract.methods.getCash().call(blockNumber);
    const totalBorrows = await contract.methods.totalBorrows().call(blockNumber);
    const totalReserves = await contract.methods.totalReserves().call(blockNumber);

    const underlyingLiquidity = new BigNumber(totalCash.toString())
      .plus(new BigNumber(totalBorrows.toString()))
      .minus(new BigNumber(totalReserves.toString()))
      .dividedBy(new BigNumber(10).pow(poolConfig.underlyingDecimals))
      .toNumber();
    const underlyingPriceUSD = await getHistoryTokenPriceFromCoingecko(poolConfig.underlyingCoingeckoId, blockTime);

    return underlyingLiquidity * underlyingPriceUSD;
  }

  public async getPoolEvents(props: CompoundGetPoolEventsProps): Promise<Array<any>> {
    const { chainConfig, poolConfig, fromBlock, toBlock } = props;

    const web3 = new Web3(chainConfig.nodeRpcs.event ? chainConfig.nodeRpcs.event : chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(poolConfig.abi, poolConfig.poolAddress);

    const mintEvents = await contract.getPastEvents('Mint', { fromBlock, toBlock });
    const redeemEvents = await contract.getPastEvents('Redeem', { fromBlock, toBlock });
    const borrowEvents = await contract.getPastEvents('Borrow', { fromBlock, toBlock });
    const repayEvents = await contract.getPastEvents('RepayBorrow', { fromBlock, toBlock });

    const transformedMintEvents = await this.transformEvents(mintEvents, web3, chainConfig, poolConfig);
    const transformedRedeemEvents = await this.transformEvents(redeemEvents, web3, chainConfig, poolConfig);
    const transformedBorrowEvents = await this.transformEvents(borrowEvents, web3, chainConfig, poolConfig);
    const transformedRepayEvents = await this.transformEvents(repayEvents, web3, chainConfig, poolConfig);

    return transformedMintEvents
      .concat(transformedRedeemEvents)
      .concat(transformedBorrowEvents)
      .concat(transformedRepayEvents);
  }

  private async transformEvents(
    events: Array<any>,
    web3: any,
    chainConfig: ChainConfig,
    poolConfig: LendingPool
  ): Promise<Array<any>> {
    const blockTimestamps: any = {};
    const transformedEvents: Array<any> = [];
    for (let i = 0; i < events.length; i++) {
      let timestamp = blockTimestamps[events[i].blockNumber];
      if (!timestamp) {
        const block = await web3.eth.getBlock(events[i].blockNumber);
        timestamp = block.timestamp;
        blockTimestamps[events[i].blockNumber] = block.timestamp;
      }

      const eventData: any = {};
      const eventName = events[i].event;
      switch (eventName) {
        case 'Mint': {
          eventData.minter = normalizeAddress(events[i].returnValues['minter']);
          eventData.mintTokens = events[i].returnValues['mintTokens'];
          eventData.mintAmount = events[i].returnValues['mintAmount'];
          break;
        }
        case 'Redeem': {
          eventData.redeemer = normalizeAddress(events[i].returnValues['redeemer']);
          eventData.redeemTokens = events[i].returnValues['redeemTokens'];
          eventData.redeemAmount = events[i].returnValues['redeemAmount'];
          break;
        }
        case 'Borrow': {
          eventData.borrower = normalizeAddress(events[i].returnValues['borrower']);
          eventData.borrowAmount = events[i].returnValues['borrowAmount'];
          eventData.accountBorrows = events[i].returnValues['accountBorrows'];
          eventData.totalBorrows = events[i].returnValues['totalBorrows'];
          break;
        }
        case 'RepayBorrow': {
          eventData.payer = normalizeAddress(events[i].returnValues['payer']);
          eventData.borrower = normalizeAddress(events[i].returnValues['borrower']);
          eventData.repayAmount = events[i].returnValues['repayAmount'];
          eventData.accountBorrows = events[i].returnValues['accountBorrows'];
          eventData.totalBorrows = events[i].returnValues['totalBorrows'];
          break;
        }
      }

      transformedEvents.push({
        chain: chainConfig.name,
        txid: `${events[i].transactionHash}:${events[i].logIndex}`,
        blockNumber: events[i].blockNumber,
        timestamp: timestamp,
        poolAddress: normalizeAddress(events[i].address),
        underlyingSymbol: poolConfig.underlyingSymbol,
        underlyingDecimals: poolConfig.underlyingDecimals,

        event: events[i].event,
        eventData: eventData,
      });
    }

    return transformedEvents;
  }

  public async summarizeDataEvents(lendingConfig: LendingConfig, allEvents: Array<any>): Promise<any> {
    const summarizeData: LendingData = {
      supplyVolumeUSD: 0,
      withdrawVolumeUSD: 0,
      borrowVolumeUSD: 0,
      repayVolumeUSD: 0,
      addressCount: 0,
      transactionCount: 0,
    };

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};

    for (let eventIdx = 0; eventIdx < allEvents.length; eventIdx++) {
      // count transactions
      if (!transactions[allEvents[eventIdx].txid.split(':')[0]]) {
        summarizeData.transactionCount += 1;
        transactions[allEvents[eventIdx].txid.split(':')[0]] = true;
      }

      // count addresses
      if (allEvents[eventIdx].eventData.minter && !addresses[allEvents[eventIdx].eventData.minter]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.minter] = true;
      }
      if (allEvents[eventIdx].eventData.redeemer && !addresses[allEvents[eventIdx].eventData.redeemer]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.redeemer] = true;
      }
      if (allEvents[eventIdx].eventData.caller && !addresses[allEvents[eventIdx].eventData.caller]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.caller] = true;
      }
      if (allEvents[eventIdx].eventData.depositor && !addresses[allEvents[eventIdx].eventData.depositor]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.depositor] = true;
      }
      if (allEvents[eventIdx].eventData.borrower && !addresses[allEvents[eventIdx].eventData.borrower]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.borrower] = true;
      }
      if (allEvents[eventIdx].eventData.payer && !addresses[allEvents[eventIdx].eventData.payer]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.payer] = true;
      }

      // count volume
      let historyPrice: number;
      if (historyPrices[getCoingeckoId(lendingConfig, allEvents[eventIdx].underlyingSymbol)]) {
        historyPrice = historyPrices[getCoingeckoId(lendingConfig, allEvents[eventIdx].underlyingSymbol)];
      } else {
        historyPrice = await getHistoryTokenPriceFromCoingecko(
          getCoingeckoId(lendingConfig, allEvents[eventIdx].underlyingSymbol),
          allEvents[eventIdx].timestamp
        );
        historyPrices[getCoingeckoId(lendingConfig, allEvents[eventIdx].underlyingSymbol)] = historyPrice;
      }

      switch (allEvents[eventIdx].event) {
        case 'Mint': {
          summarizeData.supplyVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.mintAmount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'Supply': {
          summarizeData.supplyVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.amount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'Deposit': {
          summarizeData.supplyVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.amount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'Redeem': {
          summarizeData.withdrawVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.redeemAmount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'Withdraw': {
          summarizeData.withdrawVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.amount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'Borrow': {
          if (allEvents[eventIdx].eventData.amount) {
            summarizeData.borrowVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.amount)
              .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
              .multipliedBy(historyPrice)
              .toNumber();
          } else {
            summarizeData.borrowVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.borrowAmount)
              .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
              .multipliedBy(historyPrice)
              .toNumber();
          }
          break;
        }
        case 'Repay': {
          summarizeData.repayVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.amount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
        case 'RepayBorrow': {
          summarizeData.repayVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.repayAmount)
            .dividedBy(new BigNumber(10).pow(allEvents[eventIdx].underlyingDecimals))
            .multipliedBy(historyPrice)
            .toNumber();
          break;
        }
      }
    }

    return summarizeData;
  }
}

export default CompoundProvider;
