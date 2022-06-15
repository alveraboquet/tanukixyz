import Web3 from 'web3';

import envConfig from '../../../core/env';
import { normalizeAddress } from '../../../core/helper';
import logger from '../../../core/logger';
import { ChainConfig } from '../../../core/types';
import { AaveLendingPoolConfig, LendingConfig, LendingPool, RunLendingCollectorArgv } from '../types';
import LendingProvider from './lending';

interface AaveGetPoolEventsProps {
  chainConfig: ChainConfig;
  lendingConfig: AaveLendingPoolConfig;

  // aave contracts return reserve address in event
  // we find the underlying asset by search reserve address in pool list
  pools: Array<LendingPool>;

  fromBlock: number;
  toBlock: number;
}

class AaveProvider extends LendingProvider {
  public readonly name: string = 'aave.provider';

  constructor(lendingConfig: LendingConfig) {
    super(lendingConfig);
  }

  public async getPoolEvents(props: AaveGetPoolEventsProps): Promise<Array<any>> {
    const { chainConfig, lendingConfig, pools, fromBlock, toBlock } = props;

    const web3 = new Web3(chainConfig.nodeRpcs.event ? chainConfig.nodeRpcs.event : chainConfig.nodeRpcs.default);
    const contract = new web3.eth.Contract(lendingConfig.abi, lendingConfig.address);

    const depositEvents = await contract.getPastEvents('Deposit', { fromBlock, toBlock });
    const withdrawEvents = await contract.getPastEvents('Withdraw', { fromBlock, toBlock });
    const borrowEvents = await contract.getPastEvents('Borrow', { fromBlock, toBlock });
    const repayEvents = await contract.getPastEvents('Repay', { fromBlock, toBlock });

    const transformedDepositEvents = await this.transformEvents(depositEvents, web3, chainConfig, pools);
    const transformedWithdrawEvents = await this.transformEvents(withdrawEvents, web3, chainConfig, pools);
    const transformedBorrowEvents = await this.transformEvents(borrowEvents, web3, chainConfig, pools);
    const transformedRepayEvents = await this.transformEvents(repayEvents, web3, chainConfig, pools);

    return transformedDepositEvents
      .concat(transformedWithdrawEvents)
      .concat(transformedBorrowEvents)
      .concat(transformedRepayEvents);
  }

  private static getPoolByReserveAddress(address: string, pools: Array<LendingPool>): LendingPool | null {
    for (let i = 0; i < pools.length; i++) {
      if (pools[i].poolAddress.toLowerCase() === address.toLowerCase()) {
        return pools[i];
      }
    }

    return null;
  }

  private async transformEvents(
    events: Array<any>,
    web3: any,
    chainConfig: ChainConfig,
    pools: Array<LendingPool>
  ): Promise<Array<any>> {
    // for caching
    const blockTimestamps: any = {};
    const transformedEvents: Array<any> = [];

    for (let eventIdx = 0; eventIdx < events.length; eventIdx++) {
      const underlyingPool = AaveProvider.getPoolByReserveAddress(events[eventIdx].returnValues.reserve, pools);
      if (!underlyingPool) {
        logger.onDebug({
          source: this.name,
          message: 'lending pool not found, skipped event',
          props: {
            reserve: normalizeAddress(events[eventIdx].returnValues.reserve),
          },
        });
        continue;
      }

      let timestamp = blockTimestamps[events[eventIdx].blockNumber];
      if (timestamp === undefined) {
        const block = await web3.eth.getBlock(events[eventIdx].blockNumber);
        timestamp = block.timestamp;
        blockTimestamps[events[eventIdx].blockNumber] = block.timestamp;
      }

      const eventData: any = {};
      const eventName = events[eventIdx].event;
      switch (eventName) {
        // supply AAVE v2
        case 'Deposit': {
          eventData.caller = normalizeAddress(events[eventIdx].returnValues['user']);
          eventData.depositor = normalizeAddress(events[eventIdx].returnValues['onBehalfOf']);
          eventData.amount = events[eventIdx].returnValues['amount'];
          eventData.referral = events[eventIdx].returnValues['referral'];
          break;
        }
        // supply AAVE v3
        case 'Supply': {
          eventData.caller = normalizeAddress(events[eventIdx].returnValues['user']);
          eventData.depositor = normalizeAddress(events[eventIdx].returnValues['onBehalfOf']);
          eventData.amount = events[eventIdx].returnValues['amount'];
          eventData.referral = events[eventIdx].returnValues['referralCode'];
          break;
        }
        case 'Withdraw': {
          eventData.caller = normalizeAddress(events[eventIdx].returnValues['user']);
          eventData.depositor = normalizeAddress(events[eventIdx].returnValues['to']);
          eventData.amount = events[eventIdx].returnValues['amount'];
          break;
        }
        case 'Borrow': {
          eventData.caller = normalizeAddress(events[eventIdx].returnValues['user']);
          eventData.borrower = normalizeAddress(events[eventIdx].returnValues['onBehalfOf']);
          eventData.amount = events[eventIdx].returnValues['amount'];
          eventData.borrowRate = events[eventIdx].returnValues['borrowRate'];
          break;
        }
        case 'Repay': {
          eventData.caller = normalizeAddress(events[eventIdx].returnValues['user']);
          eventData.borrower = normalizeAddress(events[eventIdx].returnValues['repayer']);
          eventData.amount = events[eventIdx].returnValues['amount'];
          break;
        }
      }

      transformedEvents.push({
        chain: chainConfig.name,
        txid: `${events[eventIdx].transactionHash}:${events[eventIdx].logIndex}`,
        blockNumber: events[eventIdx].blockNumber,
        timestamp: timestamp,
        poolAddress: normalizeAddress(events[eventIdx].address),
        underlyingSymbol: underlyingPool.underlyingSymbol,
        underlyingDecimals: underlyingPool.underlyingDecimals,

        event: events[eventIdx].event,
        eventData: eventData,
      });
    }

    return transformedEvents;
  }

  public async runCollector(options: RunLendingCollectorArgv): Promise<any> {
    const { providers } = options;

    // get db collections
    const stateCollection = await providers.database.getCollection(envConfig.database.collections.globalState);
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.lendingEventSync);
    eventCollection.createIndex({ chain: 1, protocol: 1, txid: 1 }, { background: true });
    eventCollection.createIndex({ chain: 1, protocol: 1, timestamp: 1 }, { background: true });

    const configs = this.lendingConfig.configs;
    for (let configID = 0; configID < configs.length; configID++) {
      const lendingConfig = configs[configID];

      const web3 = new Web3(
        lendingConfig.chainConfig.nodeRpcs.event
          ? lendingConfig.chainConfig.nodeRpcs.event
          : lendingConfig.chainConfig.nodeRpcs.default
      );

      const STEP = 2000;
      const latestBlock = await web3.eth.getBlockNumber();

      let startBlock = lendingConfig.lendingPool ? lendingConfig.lendingPool.genesisBlock : 0;
      const syncedState = await stateCollection
        .find({
          name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${normalizeAddress(
            lendingConfig.lendingPool?.address
          )}`,
        })
        .limit(1)
        .toArray();
      if (syncedState.length > 0) {
        startBlock = syncedState[0].blockNumber;
      }

      while (startBlock <= latestBlock) {
        const startExeTime = Math.floor(new Date().getTime() / 1000);

        const toBlock = startBlock + STEP > latestBlock ? latestBlock : startBlock + STEP;
        const events = await this.getPoolEvents({
          chainConfig: lendingConfig.chainConfig,
          lendingConfig: lendingConfig.lendingPool as AaveLendingPoolConfig,
          pools: lendingConfig.pools,
          fromBlock: startBlock,
          toBlock: toBlock,
        });
        const operations: Array<any> = [];
        for (let eventIdx = 0; eventIdx < events.length; eventIdx++) {
          operations.push({
            updateOne: {
              filter: {
                protocol: this.lendingConfig.name,
                chain: lendingConfig.chainConfig.name,
                txid: events[eventIdx].txid,
              },
              update: {
                $set: {
                  protocol: this.lendingConfig.name,
                  chain: lendingConfig.chainConfig.name,
                  txid: events[eventIdx].txid,
                  blockNumber: events[eventIdx].blockNumber,
                  timestamp: events[eventIdx].timestamp,
                  poolAddress: events[eventIdx].poolAddress,
                  underlyingSymbol: events[eventIdx].underlyingSymbol,
                  underlyingDecimals: events[eventIdx].underlyingDecimals,

                  event: events[eventIdx].event,
                  eventData: events[eventIdx].eventData,
                },
              },
              upsert: true,
            },
          });
        }

        if (operations.length > 0) {
          await eventCollection.bulkWrite(operations);
        }

        await stateCollection.updateOne(
          {
            name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${normalizeAddress(
              lendingConfig.lendingPool?.address
            )}`,
          },
          {
            $set: {
              name: `lending-events-${this.lendingConfig.name}-${lendingConfig.chainConfig.name}-${normalizeAddress(
                lendingConfig.lendingPool?.address
              )}`,
              blockNumber: toBlock,
            },
          },
          {
            upsert: true,
          }
        );

        const endExeTime = Math.floor(new Date().getTime() / 1000);
        const elapsed = endExeTime - startExeTime;

        logger.onInfo({
          source: this.name,
          message: 'sync lending events',
          props: {
            name: this.lendingConfig.name,
            chain: lendingConfig.chainConfig.name,
            block: toBlock,
            events: operations.length,
            elapsed: `${elapsed}s`,
          },
        });

        startBlock += STEP;
      }
    }
  }
}

export default AaveProvider;
