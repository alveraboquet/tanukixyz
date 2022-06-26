import {CompoundLendingConfig} from "./compound";
import {getChainConfig} from "../../../core/constants/chains";

export const BastionConfig: CompoundLendingConfig = {
	name: 'bastion',
	pools: [
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0',
			underlyingSymbol: 'ETH',
			underlyingDecimals: 18,
			underlyingCoingeckoId: 'ethereum',
		},
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0xfa786baC375D8806185555149235AcDb182C033b',
			underlyingSymbol: 'WBTC',
			underlyingDecimals: 8,
			underlyingCoingeckoId: 'bitcoin',
		},
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0x8C14ea853321028a7bb5E4FB0d0147F183d3B677',
			underlyingSymbol: 'NEAR',
			underlyingDecimals: 24,
			underlyingCoingeckoId: 'near',
		},
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0xe5308dc623101508952948b141fD9eaBd3337D99',
			underlyingSymbol: 'USDC',
			underlyingDecimals: 6,
			underlyingCoingeckoId: 'usd-coin',
		},
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0x845E15A441CFC1871B7AC610b0E922019BaD9826',
			underlyingSymbol: 'USDT',
			underlyingDecimals: 6,
			underlyingCoingeckoId: 'tether',
		},
		{
			chainConfig: getChainConfig('aurora'),
			poolAddress: '0x08Ac1236ae3982EC9463EfE10F0F320d9F5A9A4b',
			underlyingSymbol: 'BSTN',
			underlyingDecimals: 18,
			underlyingCoingeckoId: 'bastion-protocol',
		},
	]
}
