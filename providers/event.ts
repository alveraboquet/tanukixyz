import {Provider} from "../core/namespaces";
import {ChainConfig} from "../core/types";
import Web3 from "web3";

/*
*	Event provider is a simple EVM-chain liked contract events collector
* It serves by simple query past events emitted by contract address
*/

// this function used to transform event to wanted format
type EventTransformFunction = (web3: Web3, chainConfig: ChainConfig, event: any) => Promise<any>;

class EventProvider implements Provider {
	public readonly name: string = 'provider.event';

	private readonly _chainConfig: ChainConfig;
	private readonly _contractAbi: any;
	private readonly _contractAddress: string;

	private _web3: Web3;
	private _contract: any;

	constructor(chainConfig: ChainConfig, abi: any, contract: string) {
		this._chainConfig = chainConfig;
		this._contractAbi = abi;
		this._contractAddress = contract;

		// using custom rpc node for event query
		// if event node was not set, use the default rpc node
		this._web3 = new Web3(chainConfig.nodeRpcs.event ? chainConfig.nodeRpcs.event : chainConfig.nodeRpcs.default);
		this._contract = new this._web3.eth.Contract(this._contractAbi, this._contractAddress);
	}

	public async getPastEvents(eventName: string, fromBlock: number, toBlock: number, transformFunction: EventTransformFunction): Promise<any> {
		const events = await this._contract.getPastEvents(eventName, {fromBlock, toBlock});

		const transformEvents: Array<any> = [];
		for (let i = 0; i < events.length; i++) {

		}
	}
}

export default EventProvider;
