import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import envConfig from '../../../../configs/env';
import { LiquityProtocolConfig } from '../../../../configs/types';
import { getHistoryTokenPriceFromCoingecko, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { CollectorProvider } from '../../collector';
import { ProtocolData } from '../../types';

export class LiquityProvider extends CollectorProvider {
  public readonly name: string = 'collector.liquity';

  constructor(configs: LiquityProtocolConfig) {
    super(configs);
  }

  public async getDataInTimeFrame(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const dateData: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const eventCollection = await providers.database.getCollection(envConfig.database.collections.globalContractEvents);
    const events = await eventCollection
      .find({
        contract: normalizeAddress(this.configs.borrowOperation.contractAddress),
        timestamp: {
          $gte: fromTime,
          $lt: toTime,
        },
      })
      .sort({ timestamp: -1 }) // get the latest event by index 0
      .toArray();

    const web3 = new Web3(
      this.configs.chainConfig.nodeRpcs.archive
        ? this.configs.chainConfig.nodeRpcs.archive
        : this.configs.chainConfig.nodeRpcs.default
    );
    const borrowOperationContract = new web3.eth.Contract(
      this.configs.borrowOperation.contractAbi,
      this.configs.borrowOperation.contractAddress
    );
    const troveManagerContract = new web3.eth.Contract(
      this.configs.troveManager.contractAbi,
      this.configs.troveManager.contractAddress
    );

    const addresses: any = {};
    const transactions: any = {};
    for (let i = 0; i < events.length; i++) {
      // count transaction
      if (!transactions[events[i].transactionId.split(':')[0]]) {
        dateData.transactionCount += 1;
        transactions[events[i].transactionId.split(':')[0]] = true;
      }

      // count user
      if (!addresses[normalizeAddress(events[i].returnValues['_borrower'])]) {
        dateData.userCount += 1;
        addresses[normalizeAddress(events[i].returnValues['_borrower'])] = true;
      }

      switch (events[i].event) {
        case 'TroveUpdated': {
          if (Number(events[i].returnValues['operation']) === 0 || Number(events[i].returnValues['operation']) === 1) {
            // open, close trove, count volume
            dateData.volumeInUseUSD += new BigNumber(events[i].returnValues['_debt']).dividedBy(1e18).toNumber();
          } else {
            // adjust trove
            const { debt } = await troveManagerContract.methods
              .Troves(events[i].returnValues['_borrower'])
              .call(events[i].blockNumber);

            if (new BigNumber(debt).gte(new BigNumber(events[i].returnValues['_debt']))) {
              dateData.volumeInUseUSD += new BigNumber(debt.toString())
                .minus(new BigNumber(events[i].returnValues['_debt']))
                .dividedBy(1e18)
                .toNumber();
            } else {
              dateData.volumeInUseUSD += new BigNumber(events[i].returnValues['_debt'])
                .minus(new BigNumber(debt.toString()))
                .dividedBy(1e18)
                .toNumber();
            }
          }
          break;
        }
        case 'LUSDBorrowingFeePaid': {
          dateData.revenueUSD += new BigNumber(events[i].returnValues['_LUSDFee']).dividedBy(1e18).toNumber();
          break;
        }
      }
    }

    if (events.length > 0) {
      const entireSystemColl = await borrowOperationContract.methods.getEntireSystemColl().call(events[0].blockNumber);
      const ethereumPrice = await getHistoryTokenPriceFromCoingecko('ethereum', events[0].timestamp);
      dateData.totalValueLockedUSD = new BigNumber(entireSystemColl.toString())
        .multipliedBy(ethereumPrice)
        .dividedBy(1e18)
        .toNumber();
    }

    return dateData;
  }
}
