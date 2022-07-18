import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import PriceOracleAbi from '../../../../configs/abi/abracadabra/PriceOracle.json';
import { AbracadabraMarketConfig } from '../../../../configs/protocols/abracadabra';
import { normalizeAddress } from '../../../../lib/helper';

export function getMarketConfigByAddress(
  poolAddress: string,
  pools: Array<AbracadabraMarketConfig>
): AbracadabraMarketConfig | null {
  for (let i = 0; i < pools.length; i++) {
    if (normalizeAddress(pools[i].contractAddress) === normalizeAddress(poolAddress)) {
      return pools[i];
    }
  }

  return null;
}

export async function getHistoryPrice(
  web3: Web3,
  market: AbracadabraMarketConfig,
  blockNumber: number | null
): Promise<number> {
  const marketContract = new web3.eth.Contract(market.contractAbi, market.contractAddress);
  const oracleData = await marketContract.methods.oracleData().call();
  const oracleAddress = await marketContract.methods.oracle().call();
  const oracleContract = new web3.eth.Contract(PriceOracleAbi as any, oracleAddress);

  let response;
  if (blockNumber) {
    response = await oracleContract.methods.peek(oracleData).call(blockNumber);
  } else {
    response = await oracleContract.methods.peek(oracleData).call();
  }

  return new BigNumber(1e18).dividedBy(new BigNumber(response[1])).toNumber();
}
