export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolTokenData {
  chain: string;
  address: string;
  symbol: string;
  decimals: number;

  volumeInUseUSD: number;
  totalValueLockedUSD: number;
  transactionCount: number;
}

export interface ProtocolExchangeActionData {
  swapVolumeUSD: number;
  addLiquidityVolumeUSD: number;
  removeLiquidityVolumeUSD: number;
}

export interface ProtocolLendingActionData {
  supplyVolumeUSD: number;
  withdrawVolumeUSD: number;
  borrowVolumeUSD: number;
  repayVolumeUSD: number;
  liquidateVolumeUSD: number;
}

export interface ProtocolData {
  feeUSD: number;
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
    actions?: ProtocolExchangeActionData | ProtocolLendingActionData;
  };

  changes24Hours?: {
    feeUSD: number;
    totalValueLockedUSD: number;
    volumeInUseUSD: number;
    userCount: number;
    transactionCount: number;
  };
}
