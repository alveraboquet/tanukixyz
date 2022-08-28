import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import ERC20 from '../../../../configs/abi/ERC20.json';
import envConfig from '../../../../configs/env';
import { AaveProtocolConfig, TokenConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import logger from '../../../../lib/logger';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData, ProtocolLendingActionData, ProtocolTokenData } from '../../types';
import { getReserveConfig } from './helpers';

export class AaveProvider extends CollectorProvider {
  public readonly name: string = 'collector.aave';

  constructor(configs: AaveProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,

      detail: {
        tokens: [],
      },
    };

    const configs: AaveProtocolConfig = this.configs;
    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);

    const addresses: any = {};
    const transactions: any = {};
    const historyPrices: any = {};
    const tokens: any = {};
    const actions: ProtocolLendingActionData = {
      supplyVolumeUSD: 0,
      withdrawVolumeUSD: 0,
      borrowVolumeUSD: 0,
      repayVolumeUSD: 0,
      liquidateVolumeUSD: 0,
    };

    for (const poolConfig of configs.pools) {
      const events = await eventCollection
        .find({
          chain: poolConfig.chainConfig.name,
          contract: normalizeAddress(poolConfig.contractAddress),
          timestamp: {
            $gte: fromTime,
            $lt: toTime,
          },
        })
        .sort({ timestamp: -1 }) // get the latest event by index 0
        .toArray();

      for (const event of events) {
        const reserveAddress = event.returnValues.reserve ? event.returnValues.reserve : event.returnValues['_reserve'];

        // will support liquidation volume later, skip for now
        if (event.event === 'LiquidationCall' || !reserveAddress) continue;

        const reserveConfig: TokenConfig | undefined = getReserveConfig(reserveAddress);
        if (reserveConfig === undefined) {
          logger.onDebug({
            source: this.name,
            message: 'reserve config not found',
            props: {
              chain: event.chain,
              reserve: normalizeAddress(reserveAddress),
            },
          });
          continue;
        }

        if (!reserveConfig.chains[poolConfig.chainConfig.name]) {
          logger.onDebug({
            source: this.name,
            message: 'reserve address not found',
            props: {
              pool: normalizeAddress(poolConfig.contractAddress),
              reserve: normalizeAddress(reserveAddress),
            },
          });
        }

        // count transaction
        if (!transactions[event.transactionId.split(':')[0]]) {
          transactions[event.transactionId.split(':')[0]] = true;
          data.transactionCount += 1;

          if (tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`]) {
            tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`].transactionCount += 1;
          } else {
            tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`] = {
              chain: poolConfig.chainConfig.name,
              symbol: reserveConfig.symbol,
              address: reserveAddress,
              decimals: reserveConfig.chains[poolConfig.chainConfig.name].decimals,

              volumeInUseUSD: 0,
              totalValueLockedUSD: 0,
              transactionCount: 1,
            };
          }
        }

        // count user
        const _user = event.returnValues['_user'] ? normalizeAddress(event.returnValues['_user']) : null;
        const _repayer = event.returnValues['_repayer'] ? normalizeAddress(event.returnValues['_repayer']) : null;
        const user = event.returnValues['user'] ? normalizeAddress(event.returnValues['user']) : null;
        const onBehalfOf = event.returnValues['onBehalfOf'] ? normalizeAddress(event.returnValues['onBehalfOf']) : null;
        const repayer = event.returnValues['repayer'] ? normalizeAddress(event.returnValues['repayer']) : null;
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

        // get history price
        let historyPrice: number;
        if (historyPrices[reserveConfig.coingeckoId]) {
          historyPrice = historyPrices[reserveConfig.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(reserveConfig.coingeckoId, fromTime);
          historyPrices[reserveConfig.coingeckoId] = historyPrice;
        }

        let volume: number = 0;
        if (event.returnValues['_amount']) {
          volume =
            new BigNumber(event.returnValues['_amount'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[event.chain].decimals))
              .toNumber() * historyPrice;
        }
        if (event.returnValues['_amountMinusFees']) {
          volume =
            new BigNumber(event.returnValues['_amountMinusFees'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[event.chain].decimals))
              .toNumber() * historyPrice;
        }
        if (event.returnValues['amount']) {
          volume =
            new BigNumber(event.returnValues['amount'])
              .dividedBy(new BigNumber(10).pow(reserveConfig.chains[event.chain].decimals))
              .toNumber() * historyPrice;
        }

        switch (event.event) {
          case 'Deposit':
          case 'Supply': {
            actions.supplyVolumeUSD += volume;
            break;
          }
          case 'RedeemUnderlying':
          case 'Withdraw': {
            actions.withdrawVolumeUSD += volume;
            break;
          }
          case 'Borrow': {
            actions.borrowVolumeUSD += volume;
            break;
          }
          case 'Repay': {
            actions.repayVolumeUSD += volume;
            break;
          }
        }

        if (tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`]) {
          tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`].volumeInUseUSD += volume;
        } else {
          tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`] = {
            chain: poolConfig.chainConfig.name,
            symbol: reserveConfig.symbol,
            address: reserveAddress,
            decimals: reserveConfig.chains[poolConfig.chainConfig.name].decimals,

            volumeInUseUSD: volume,
            totalValueLockedUSD: 0,
            transactionCount: 0,
          };
        }

        data.volumeInUseUSD += volume;
      }

      // count liquidity
      const web3 = new Web3(poolConfig.chainConfig.nodeRpcs.default);
      const poolContract = new web3.eth.Contract(poolConfig.contractAbi, poolConfig.contractAddress);
      let reserveList: any;
      try {
        reserveList = await poolContract.methods.getReserves().call();
      } catch (e: any) {
        reserveList = await poolContract.methods.getReservesList().call();
      }

      reserveList = reserveList as Array<string>;
      for (const reserveAddress of reserveList) {
        const reserveConfig: TokenConfig | undefined = getReserveConfig(reserveAddress);
        if (reserveConfig === undefined) {
          logger.onDebug({
            source: this.name,
            message: 'reserve config not found',
            props: {
              chain: poolConfig.chainConfig.name,
              reserve: normalizeAddress(reserveAddress),
            },
          });
          continue;
        }

        let historyPrice: number;
        if (historyPrices[reserveConfig.coingeckoId]) {
          historyPrice = historyPrices[reserveConfig.coingeckoId];
        } else {
          historyPrice = await getHistoryTokenPriceFromCoingecko(reserveConfig.coingeckoId, fromTime);
          historyPrices[reserveConfig.coingeckoId] = historyPrice;
        }

        let reserveAmount = 0;
        if (normalizeAddress(reserveAddress) !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          try {
            const reserveData = await poolContract.methods.getReserveData(reserveAddress).call();
            const reserveContract = new web3.eth.Contract(ERC20 as any, reserveAddress);
            const reserveBalance = await reserveContract.methods.balanceOf(reserveData.aTokenAddress).call();
            reserveAmount =
              new BigNumber(reserveBalance.toString())
                .dividedBy(new BigNumber(10).pow(reserveConfig.chains[poolConfig.chainConfig.name].decimals))
                .toNumber() * historyPrice;
          } catch (e: any) {
            logger.onDebug({
              source: this.name,
              message: 'cannot query reserve data',
              props: {
                chain: poolConfig.chainConfig.name,
                token: normalizeAddress(reserveAddress),
              },
            });
          }
        }

        if (tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`]) {
          tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`].totalValueLockedUSD +=
            reserveAmount;
        } else {
          tokens[`${poolConfig.chainConfig.name}:${normalizeAddress(reserveAddress)}`] = {
            chain: poolConfig.chainConfig.name,
            symbol: reserveConfig.symbol,
            address: reserveAddress,
            decimals: reserveConfig.chains[poolConfig.chainConfig.name].decimals,

            volumeInUseUSD: 0,
            totalValueLockedUSD: reserveAmount,
            transactionCount: 0,
          };
        }

        data.totalValueLockedUSD += reserveAmount;
      }
    }

    if (data.detail) {
      for (const [, token] of Object.entries(tokens)) {
        data.detail.tokens.push(token as ProtocolTokenData);
      }

      data.detail.actions = actions;
    }

    return data;
  }
}
