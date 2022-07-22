export interface UniswapAddressPoolData {
  poolAddress: string;
  tokens: Array<{
    symbol: string;
    address: string;
  }>;
  liquidityBalance: number;
  liquidityTotalSupply: number;
}

export interface UniswapAddressData {
  liquidityPositions: Array<UniswapAddressPoolData>;
}
