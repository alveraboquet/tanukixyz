import { DefaultTokenList } from '../../../../configs/constants/defaultTokenList';
import { RibbonProtocolConfig } from '../../../../configs/protocols/ribbon';
import { ShareProviders } from '../../../../lib/types';

const vaultMap: any = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': DefaultTokenList.ETH,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': DefaultTokenList.USDC,
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': DefaultTokenList.WBTC,
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': DefaultTokenList.AAVE,
  '0xae78736cd615f374d3085123a210448e74fc6393': {
    symbol: 'rETH',
    coingeckoId: 'rocket-pool-eth',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  '0x4d224452801aced8b2f0aebe155379bb5d594381': {
    symbol: 'APE',
    coingeckoId: 'apecoin',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
};

export async function queryVaultTransactions(
  config: RibbonProtocolConfig,
  providers: ShareProviders,
  fromTime: number,
  toTime: number
): Promise<Array<any>> {
  let transactions: Array<any> = [];

  let startTime = 0;

  for (let sid = 0; sid < config.subgraphs.length; sid++) {
    startTime = fromTime;
    while (startTime <= toTime) {
      const query = `
			{
				vaultTransactions(first: 1000, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
					vault {
					  underlyingAsset
            underlyingDecimals
          }
          address
          txhash
          underlyingAmount
          timestamp
				}
			}
		`;

      const response = await providers.subgraph.querySubgraph(config.subgraphs[sid].endpoint, query);
      const vaultTransactions: Array<any> =
        response && response['vaultTransactions'] ? response['vaultTransactions'] : [];

      for (let i = 0; i < vaultTransactions.length; i++) {
        transactions.push({
          assetToken: vaultMap[vaultTransactions[i].vault.underlyingAsset],
          ...vaultTransactions[i],
        });
      }

      if (vaultTransactions.length > 0) {
        startTime = vaultTransactions[vaultTransactions.length - 1] + 1;
      } else {
        break;
      }
    }
  }

  return transactions;
}

export async function queryVaults(config: RibbonProtocolConfig, providers: ShareProviders): Promise<Array<any>> {
  let vaults: Array<any> = [];

  for (let sid = 0; sid < config.subgraphs.length; sid++) {
    const query = `
			{
				vaults(first: 1000) {
					underlyingAsset
          underlyingDecimals
          totalBalance
				}
			}
		`;

    const response = await providers.subgraph.querySubgraph(config.subgraphs[sid].endpoint, query);
    const vaultConfigs: Array<any> = response && response['vaults'] ? response['vaults'] : [];

    for (let i = 0; i < vaultConfigs.length; i++) {
      vaults.push({
        assetToken: vaultMap[vaultConfigs[i].underlyingAsset],
        ...vaultConfigs[i],
      });
    }
  }

  return vaults;
}
