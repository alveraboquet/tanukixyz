export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolDetailData {
  version: 'univ2' | 'univ3' | 'compound' | 'aave';
  data: any;
}

export interface ProtocolData {
  revenueUSD: number;
  totalValueLockedUSD: number;
  volumeInUseUSD: number;
  userCount: number;
  transactionCount: number;

  // protocol tokenomics
  // some protocols don't have any token
  // this field is not required
  tokenomics?: ProtocolTokenomics;

  // breakdown data about protocol
  // every protocol have diff type of data
  detail?: ProtocolDetailData;
}
