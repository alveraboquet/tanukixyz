import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import ERC20 from '../../../../configs/abi/ERC20.json';
import envConfig from '../../../../configs/env';
import { AaveProtocolConfig, TokenConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import { CollectorProvider } from '../collector';
import { CollectorHook } from '../hook';
import { getReserveConfig } from './helpers';

export class AaveProvider extends CollectorProvider {
  public readonly name: string = 'provider.aave';

  constructor(configs: AaveProtocolConfig, hook: CollectorHook | null) {
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

    const configs: AaveProtocolConfig = this.configs;
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};

    for (let poolId = 0; poolId < configs.pools.length; poolId++) {
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

      for (let i = 0; i < events.length; i++) {
        // count transaction
        if (!transactions[events[i].transactionId.split(':')[0]]) {
          transactions[events[i].transactionId.split(':')[0]] = true;
          data.transactionCount += 1;
        }

        // count user
        const _user = events[i].returnValues['_user'] ? normalizeAddress(events[i].returnValues['_user']) : null;
        const _repayer = events[i].returnValues['_repayer']
          ? normalizeAddress(events[i].returnValues['_repayer'])
          : null;
        const user = events[i].returnValues['user'] ? normalizeAddress(events[i].returnValues['user']) : null;
        const onBehalfOf = events[i].returnValues['onBehalfOf']
          ? normalizeAddress(events[i].returnValues['onBehalfOf'])
          : null;
        const repayer = events[i].returnValues['repayer'] ? normalizeAddress(events[i].returnValues['repayer']) : null;
        if (_user && !addresses[_user]) {
          addresses[_user] = true;
          data.userCount += 1;
        }
        if (_repayer && !addresses[_repayer]) {
          addresses[_repayer] = true;
          data.userCount += 1;
        }
        if (user && !addresses[user]) {
          addresses[user] = true;
          data.userCount += 1;
        }
        if (onBehalfOf && !addresses[onBehalfOf]) {
          addresses[onBehalfOf] = true;
          data.userCount += 1;
        }
        if (repayer && !addresses[repayer]) {
          addresses[repayer] = true;
          data.userCount += 1;
        }

        const reserveAddress = events[i].returnValues.reserve
          ? events[i].returnValues.reserve
          : events[i].returnValues['_reserve'];
        const reserveConfig: TokenConfig | undefined = getReserveConfig(reserveAddress);
        if (reserveConfig === undefined) {
          logger.onDebug({
            source: this.name,
            message: 'reserve config not found',
            props: {
              chain: events[i].chain,
              reserve: normalizeAddress(reserveAddress),
            },
          });
          continue;
        }

        // get history price
        let historyPrice: number;
        if (historyPrices[reserveConfig.coingeckoId]) {
          historyPrice = historyPrices[reserveConfig.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(reserveConfig.coingeckoId, events[0].timestamp);
          historyPrices[reserveConfig.coingeckoId] = historyPrice;
        }

        let volume: number = 0;
        if (events[i].returnValues['_amount']) {
          volume =
            new BigNumber(events[i].returnValues['_amount'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[events[i].chain].decimals))
              .toNumber() * historyPrice;
        }
        if (events[i].returnValues['_amountMinusFees']) {
          volume =
            new BigNumber(events[i].returnValues['_amountMinusFees'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[events[i].chain].decimals))
              .toNumber() * historyPrice;
        }
        if (events[i].returnValues['amount']) {
          volume =
            new BigNumber(events[i].returnValues['amount'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[events[i].chain].decimals))
              .toNumber() * historyPrice;
        }

        if (volume > 100000000000) {
          console.info(events[i]);
          process.exit(0);
        }

        data.volumeInUseUSD += volume;
      }

      // count liquidity
      const web3 = new Web3(configs.pools[poolId].chainConfig.nodeRpcs.default);
      const poolContract = new web3.eth.Contract(
        configs.pools[poolId].contractAbi,
        configs.pools[poolId].contractAddress
      );
      let reserveList: any;
      try {
        reserveList = await poolContract.methods.getReserves().call();
      } catch (e: any) {
        reserveList = await poolContract.methods.getReservesList().call();
      }

      reserveList = reserveList as Array<string>;
      for (let i = 0; i < reserveList.length; i++) {
        const reserveConfig: TokenConfig | undefined = getReserveConfig(reserveList[i]);
        if (reserveConfig === undefined) {
          logger.onDebug({
            source: this.name,
            message: 'reserve config not found',
            props: {
              chain: configs.pools[poolId].chainConfig.name,
              reserve: normalizeAddress(reserveList[i]),
            },
          });
          continue;
        }

        let historyPrice: number;
        if (historyPrices[reserveConfig.coingeckoId]) {
          historyPrice = historyPrices[reserveConfig.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(reserveConfig.coingeckoId, events[0].timestamp);
          historyPrices[reserveConfig.coingeckoId] = historyPrice;
        }

        let reserveAmount = 0;
        if (normalizeAddress(reserveList[i]) !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          try {
            const reserveData = await poolContract.methods.getReserveData(reserveList[i]).call();
            const reserveContract = new web3.eth.Contract(ERC20 as any, reserveList[i]);
            const reserveBalance = await reserveContract.methods.balanceOf(reserveData.aTokenAddress).call();
            reserveAmount =
              new BigNumber(reserveBalance.toString())
                .dividedBy(new BigNumber(10).pow(reserveConfig.chains[configs.pools[poolId].chainConfig.name].decimals))
                .toNumber() * historyPrice;
          } catch (e: any) {
            logger.onDebug({
              source: this.name,
              message: 'cannot query reserve data',
              props: {
                token: normalizeAddress(reserveList[i]),
              },
            });
          }
        }

        data.totalValueLockedUSD += reserveAmount;
      }
    }

    return data;
  }
}
