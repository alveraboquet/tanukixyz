import Web3 from 'web3';

import { normalizeAddress } from '../../../core/helper';
import { ChainConfig } from '../../../core/types';
import { LendingConfig, LendingPool } from '../types';
import LendingProvider from './lending';

class CompoundProvider extends LendingProvider {
  public readonly name: string = 'compound.provider';

  constructor(lendingConfig: LendingConfig) {
    super(lendingConfig);
  }

  public async getPoolEvents(
    chainConfig: ChainConfig,
    poolConfig: LendingPool,
    fromBlock: number,
    toBlock: number
  ): Promise<Array<any>> {
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
}

export default CompoundProvider;
