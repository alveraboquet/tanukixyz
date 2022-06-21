import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import TroveManagerAbi from '../../../core/abi/liquity/TroveManager.json';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../core/helper';
import { ChainConfig } from '../../../core/types';
import { getCoingeckoId } from '../helpers';
import { LendingConfig, LendingData, LendingPool } from '../types';
import LendingProvider from './lending';

interface LiquityGetPoolEventsProps {
  chainConfig: ChainConfig;
  poolConfig: LendingPool;
  fromBlock: number;
  toBlock: number;
}

interface LiquityGetPoolLiquidity {
  chainConfig: ChainConfig;
  poolConfig: LendingPool;
  blockNumber: number;
  blockTime: number;
}

class LiquityProvider extends LendingProvider {
  public readonly name: string = 'liquity.provider';

  constructor(lendingConfig: LendingConfig) {
    super(lendingConfig);
  }

  public async getLiquidityLocked(props: LiquityGetPoolLiquidity): Promise<number> {
    const { chainConfig, poolConfig, blockNumber, blockTime } = props;

    const web3 = new Web3(chainConfig.nodeRpcs.archive ? chainConfig.nodeRpcs.archive : chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(poolConfig.abi, poolConfig.poolAddress);

    const entireSystemColl = await contract.methods.getEntireSystemColl().call(blockNumber);
    const ethereumPrice = await getHistoryTokenPriceFromCoingecko(poolConfig.underlyingCoingeckoId, blockTime);
    return new BigNumber(entireSystemColl.toString()).multipliedBy(ethereumPrice).dividedBy(1e18).toNumber();
  }

  public async getPoolEvents(props: LiquityGetPoolEventsProps): Promise<Array<any>> {
    const { chainConfig, poolConfig, fromBlock, toBlock } = props;

    const web3 = new Web3(
      chainConfig.nodeRpcs.event ? (chainConfig.nodeRpcs.event as string) : chainConfig.nodeRpcs.default
    );
    const contract = new web3.eth.Contract(poolConfig.abi, poolConfig.poolAddress);

    const troveCreatedEvents = await contract.getPastEvents('TroveCreated', { fromBlock, toBlock });
    const troveUpdatedEvents = await contract.getPastEvents('TroveUpdated', { fromBlock, toBlock });

    const blockTimestamps: any = {};
    const transformedEvents: Array<any> = [];
    for (let i = 0; i < troveCreatedEvents.length; i++) {
      let timestamp = blockTimestamps[troveCreatedEvents[i].blockNumber];
      if (!timestamp) {
        const block = await web3.eth.getBlock(troveCreatedEvents[i].blockNumber);
        timestamp = block.timestamp;
        blockTimestamps[troveCreatedEvents[i].blockNumber] = block.timestamp;
      }

      transformedEvents.push({
        chain: chainConfig.name,
        txid: `${troveCreatedEvents[i].transactionHash}:${troveCreatedEvents[i].logIndex}`,
        blockNumber: troveCreatedEvents[i].blockNumber,
        timestamp: timestamp,
        poolAddress: normalizeAddress(troveCreatedEvents[i].address),
        underlyingSymbol: poolConfig.underlyingSymbol,
        underlyingDecimals: poolConfig.underlyingDecimals,
        event: troveCreatedEvents[i].event,
        eventData: {
          borrower: normalizeAddress(troveCreatedEvents[i].returnValues['_borrower']),
          arrayIndex: Number(troveCreatedEvents[i].returnValues['arrayIndex']),
        },
      });
    }

    for (let i = 0; i < troveUpdatedEvents.length; i++) {
      let timestamp = blockTimestamps[troveUpdatedEvents[i].blockNumber];
      if (!timestamp) {
        const block = await web3.eth.getBlock(troveUpdatedEvents[i].blockNumber);
        timestamp = block.timestamp;
        blockTimestamps[troveUpdatedEvents[i].blockNumber] = block.timestamp;
      }

      transformedEvents.push({
        chain: chainConfig.name,
        txid: `${troveUpdatedEvents[i].transactionHash}:${troveUpdatedEvents[i].logIndex}`,
        blockNumber: troveUpdatedEvents[i].blockNumber,
        timestamp: timestamp,
        poolAddress: normalizeAddress(troveUpdatedEvents[i].address),
        underlyingSymbol: poolConfig.underlyingSymbol,
        underlyingDecimals: poolConfig.underlyingDecimals,
        event: troveUpdatedEvents[i].event,
        eventData: {
          borrower: normalizeAddress(troveUpdatedEvents[i].returnValues['_borrower']),
          debt: troveUpdatedEvents[i].returnValues['_debt'],
          coll: troveUpdatedEvents[i].returnValues['_coll'],
          stake: troveUpdatedEvents[i].returnValues['stake'],
          operation: Number(troveUpdatedEvents[i].returnValues['operation']),
        },
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

    const chainConfig: ChainConfig = lendingConfig.configs[0].chainConfig;
    const poolConfig: LendingPool = lendingConfig.configs[0].pools[0];

    const web3 = new Web3(chainConfig.nodeRpcs.archive ? chainConfig.nodeRpcs.archive : chainConfig.nodeRpcs.default);
    const borrowOperationContract = new web3.eth.Contract(poolConfig.abi, poolConfig.poolAddress);

    const addresses: any = {};
    const transactions: any = {};
    for (let eventIdx = 0; eventIdx < allEvents.length; eventIdx++) {
      // count transactions
      if (!transactions[allEvents[eventIdx].txid.split(':')[0]]) {
        summarizeData.transactionCount += 1;
        transactions[allEvents[eventIdx].txid.split(':')[0]] = true;
      }

      // open trove, borrow case
      if (allEvents[eventIdx].eventData.borrower && !addresses[allEvents[eventIdx].eventData.borrower]) {
        summarizeData.addressCount += 1;
        addresses[allEvents[eventIdx].eventData.borrower] = true;
      }

      // count volume
      if (allEvents[eventIdx].event === 'TroveUpdated' && allEvents[eventIdx].eventData.operation === 0) {
        // open trove, borrow case
        summarizeData.borrowVolumeUSD += new BigNumber(allEvents[eventIdx].eventData.debt).dividedBy(1e18).toNumber();
      } else {
        const troveManagerAddress = await borrowOperationContract.methods.troveManager().call();
        const troveManagerContract = new web3.eth.Contract(TroveManagerAbi as any, troveManagerAddress);
        const { debt } = await troveManagerContract.methods
          .Troves(allEvents[eventIdx].eventData.borrower)
          .call(allEvents[eventIdx].blockNumber);

        if (allEvents[eventIdx].event === 'TroveUpdated' && allEvents[eventIdx].eventData.operation === 0) {
          // close trove, repay case
          const volume = new BigNumber(debt.toString()).minus(new BigNumber(allEvents[eventIdx].eventData.debt));
          summarizeData.borrowVolumeUSD += volume.dividedBy(1e18).toNumber();
        } else if (allEvents[eventIdx].event === 'TroveUpdated') {
          // adjust trove, repay or borrow case
          if (new BigNumber(debt).gte(new BigNumber(allEvents[eventIdx].eventData.debt))) {
            // repay
            const volume = new BigNumber(debt.toString()).minus(new BigNumber(allEvents[eventIdx].eventData.debt));
            summarizeData.borrowVolumeUSD += volume.dividedBy(1e18).toNumber();
          } else {
            // borrow
            const volume = new BigNumber(allEvents[eventIdx].eventData.debt).minus(new BigNumber(debt.toString()));
            summarizeData.borrowVolumeUSD += volume.dividedBy(1e18).toNumber();
          }
        }
      }
    }

    return summarizeData;
  }
}

export default LiquityProvider;
