import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { EnsProtocolConfig } from '../../../../configs/protocols/ens';
import { getHistoryTokenPriceFromCoingecko, getTimestamp, normalizeAddress } from '../../../../lib/helper';
import { ShareProviders } from '../../../../lib/types';
import { ProtocolData } from '../../types';
import { CollectorProvider, GetProtocolDataProps } from '../collector';
import { CollectorHook } from '../hook';

export class EnsProvider extends CollectorProvider {
  public readonly name: string = 'provider.ens';

  constructor(configs: EnsProtocolConfig, hook: CollectorHook | null) {
    super(configs, hook);
  }

  private async getDataInRange(providers: ShareProviders, fromTime: number, toTime: number): Promise<ProtocolData> {
    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: EnsProtocolConfig = this.configs;

    // eth price
    const ethPrice = await getHistoryTokenPriceFromCoingecko('ethereum', getTimestamp());
    const web3 = new Web3(configs.chain.nodeRpcs.default);

    let startTime = fromTime;
    while (startTime <= toTime) {
      try {
        const query = `
					{
						nameRegistereds(first: 1000, where: {registration_: {registrationDate_gte: ${fromTime}, registrationDate_lte: ${toTime}}, orderBy: blockNumber, orderDirection: desc) {
							registration {
								registrationDate
								cost
							}
							transactionID
						}
					}
				`;
        const response = await providers.subgraph.querySubgraph(configs.subgraph, query);
        const registers: Array<any> = response && response['nameRegistereds'] ? response['nameRegistereds'] : [];

        const addresses: any = {};
        const transactions: any = {};
        for (let i = 0; i < registers.length; i++) {
          const cost = new BigNumber(registers[i]['registration']['cost'])
            .dividedBy(1e18)
            .multipliedBy(ethPrice)
            .toNumber();
          data.revenueUSD += cost;
          data.volumeInUseUSD += cost;

          if (!transactions[registers[i]['transactionID']]) {
            data.transactionCount += 1;
            transactions[registers[i]['transactionID']] = true;
          }

          const transaction = await web3.eth.getTransactionReceipt(registers[i]['transactionID']);
          if (!addresses[normalizeAddress(transaction.from)]) {
            data.userCount += 1;
            addresses[normalizeAddress(transaction.from)] = true;
          }
        }
      } catch (e: any) {}
    }

    return data;
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return await this.getDataInRange(props.providers, props.date - 24 * 60 * 60, props.date);
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return await this.getDataInRange(props.providers, props.date, props.date + 24 * 60 * 60);
  }
}
