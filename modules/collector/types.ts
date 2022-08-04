export interface ProtocolTokenomics {
  priceUSD: number;
  marketCapUSD: number;
}

export interface ProtocolDataChange {
  revenueChangePercentage: number;
  totalValueLockedChangePercentage: number;
  volumeInUseChangePercentage: number;
  userCountChangePercentage: number;
  transactionCountChangePercentage: number;
}

export interface ProtocolData {
  revenueUSD: number;
  totalValueLockedUSD: number;
  volumeInUseUSD: number;
  userCount: number;
  transactionCount: number;

  tokenomics?: ProtocolTokenomics;
  changes?: ProtocolDataChange;

  // bad debts metrics on lending platform
  badDebtUSD?: number;
  insolventUserCount?: number;

  revenue?: any;
  totalValueLocked?: any;
  volume?: any;
  user?: any;
  transaction?: any;
}
