export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolTokenData {
  chain: string;
  address: string;
  symbol: string;
  decimals: number;
  logoURI: string | null;

  volumeUSD: number;
  liquidityUSD: number;
  txCount: number;
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
  detail?: {
    tokens: Array<ProtocolTokenData>;
  };
}
