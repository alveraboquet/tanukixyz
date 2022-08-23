import { Interface } from '@ethersproject/abi';
import Web3 from 'web3';

import Multicall2ABI from '../configs/abi/Multicall2.json';
import { getChainConfig } from '../configs/chains';
import { Contracts } from '../configs/constants/contracts';

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async <T = any>(chain: string, abi: any[], calls: Call[]): Promise<T> => {
  const web3 = new Web3(getChainConfig(chain).nodeRpcs.default);
  const contract = new web3.eth.Contract(Multicall2ABI as any, Contracts.multicall[chain]);
  const itf = new Interface(abi);

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }));

  const returnData = await contract.methods.tryAggregate(false, calldata).call();
  const res = returnData.map((call: any, i: number) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res as any;
};
