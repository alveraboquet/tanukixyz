import {TokenConfig} from "../types";

export const TokenList: {[key: string]: TokenConfig} = {
	ETH: {
		name: 'ethereum',
		symbol: 'ETH',
		coingeckoId: 'ethereum',
	},
	BTC: {
		name: 'bitcoin',
		symbol: 'BTC',
		coingeckoId: 'bitcoin',
	},
	BNB: {
		name: 'binance',
		symbol: 'BNB',
		coingeckoId: 'binancecoin',
	},
	AVAX: {
		name: 'avalanche',
		symbol: 'AVAX',
		coingeckoId: 'avalanche-2',
	},
	MATIC: {
		name: 'polygon',
		symbol: 'MATIC',
		coingeckoId: 'matic-token',
	},
	FTM: {
		name: 'fantom',
		symbol: 'FTM',
		coingeckoId: 'fantom',
	},
	NEAR: {
		name: 'near',
		symbol: 'NEAR',
		coingeckoId: 'near',
	},
	CRO: {
		name: 'cronos',
		symbol: 'CRO',
		coingeckoId: 'crypto-com-chain',
	},
	CELO: {
		name: 'celo',
		symbol: 'CELO',
		coingeckoId: 'celo',
	},
	ONE: {
		name: 'harmony',
		symbol: 'ONE',
		coingeckoId: 'harmony',
	},
	FUSE: {
		name: 'fuse',
		symbol: 'FUSE',
		coingeckoId: 'fuse-network-token',
	},
}
