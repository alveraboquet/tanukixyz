import BigNumber from 'bignumber.js';

import { getHistoryTokenPriceFromCoingecko } from '../../core/helper';
import { LendingConfig, LendingData } from './types';

function getCoingeckoId(lendingConfig: LendingConfig, symbol: string): string {
  for (let configIdx = 0; configIdx < lendingConfig.configs.length; configIdx++) {
    for (let poolIdx = 0; poolIdx < lendingConfig.configs[configIdx].pools.length; poolIdx++) {
      if (symbol === lendingConfig.configs[configIdx].pools[poolIdx].underlyingSymbol) {
        return lendingConfig.configs[configIdx].pools[poolIdx].underlyingCoingeckoId;
      }
    }
  }

  return '';
}

export async function summarizeDataEvents(lendingConfig: LendingConfig, allEvents: Array<any>): Promise<any> {
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
