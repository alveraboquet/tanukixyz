import Web3 from 'web3';

import { CurveProtocolConfig } from '../../../../configs/protocols/curve';
import { Call, multicallv2 } from '../../../../lib/multicall';
import { CollectorProvider, GetProtocolDataProps } from '../../collector';
import { ProtocolData } from '../../types';

export class CurveProvider extends CollectorProvider {
  public readonly name: string = 'collector.curve';

  constructor(configs: CurveProtocolConfig) {
    super(configs);
  }

  public async getDailyData(props: GetProtocolDataProps): Promise<ProtocolData> {
    // const { providers, date } = props;

    const data: ProtocolData = {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };

    const configs: CurveProtocolConfig = this.configs;

    for (const [, factory] of Object.entries(configs.factories)) {
      const web3 = new Web3(factory.chainConfig.nodeRpcs.default);
      const factoryContract = new web3.eth.Contract(factory.contractAbi, factory.contractAddress);
      const poolCount = await factoryContract.methods.pool_count().call();

      const calls: Array<Call> = [];

      for (let i = 0; i < Number(poolCount); i++) {
        calls.push({
          address: factory.contractAddress,
          name: 'pool_list',
          params: [i],
        });
      }

      const results: Array<string> = await multicallv2(factory.chainConfig.name, factory.contractAbi, calls);
      console.info(results);
    }

    return data;
  }

  public async getDateData(props: GetProtocolDataProps): Promise<ProtocolData> {
    return {
      revenueUSD: 0,
      totalValueLockedUSD: 0,
      volumeInUseUSD: 0,
      userCount: 0,
      transactionCount: 0,
    };
  }
}
