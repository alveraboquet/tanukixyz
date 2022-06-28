import envConfig from '../env';
import { ChainConfig } from '../types';
import { TokenList } from './tokens';

const ALCHEMY_KEY = envConfig.apiKeys.alchemy;
const MORALIS_KEY = envConfig.apiKeys.moralis;

export const Blockchains: Array<ChainConfig> = [
  {
    network: 'mainnet',
    family: 'evm',
    name: 'ethereum',
    nodeRpcs: {
      default: `https://rpc.ankr.com/eth`, // should be public rpc
      archive: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      event: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    },
    blockSubgraph: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    nativeToken: TokenList.ETH,
  },
  {
    network: 'mainnet',
    family: 'bitcore',
    name: 'bitcoin',
    nodeRpcs: {
      default: `https://btc.getblock.io/rest`,
    },
    nativeToken: TokenList.BTC,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'avalanche',
    nodeRpcs: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
      archive: `https://rpc.ankr.com/avalanche`,
      event: 'https://api.avax.network/ext/bc/C/rpc',
    },
    blockSubgraph: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks',
    nativeToken: TokenList.AVAX,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'polygon',
    nodeRpcs: {
      default: 'https://rpc.ankr.com/polygon',
      archive: `https://rpc.ankr.com/polygon`,
      event: 'https://rpc.ankr.com/polygon',
    },
    blockSubgraph: 'https://api.thegraph.com/subgraphs/name/matthewlilley/polygon-blocks',
    nativeToken: TokenList.MATIC,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'fantom',
    nodeRpcs: {
      default: 'https://rpc.ftm.tools/',
      archive: 'https://rpc.ankr.com/fantom',
      event: 'https://rpc.ankr.com/fantom',
    },
    blockSubgraph: 'https://api.thegraph.com/subgraphs/name/matthewlilley/fantom-blocks',
    nativeToken: TokenList.FTM,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'binance',
    nodeRpcs: {
      default: 'https://bscrpc.com',
      archive: `https://bscrpc.com`,
      event: 'https://bscrpc.com',
    },
    blockSubgraph: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bsc-blocks',
    nativeToken: TokenList.BNB,
  },
  {
    network: 'mainnet',
    family: 'near',
    name: 'near',
    nodeRpcs: {
      default: 'https://archival-rpc.mainnet.near.org',
    },
    nativeToken: TokenList.NEAR,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'metis',
    nodeRpcs: {
      default: 'https://andromeda.metis.io/?owner=1088',
    },
    blockSubgraph: 'https://api.netswap.io/graph/subgraphs/name/netswap/blocks',
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'harmony',
    nodeRpcs: {
      default: 'https://api.harmony.one',
    },
    nativeToken: TokenList.ONE,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'aurora',
    nodeRpcs: {
      default: 'https://mainnet.aurora.dev/',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'cronos',
    nodeRpcs: {
      default: 'https://evm.cronos.org',
    },
    blockSubgraph: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/blocks',
    nativeToken: TokenList.CRO,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'celo',
    nodeRpcs: {
      default: 'https://forno.celo.org',
    },
    nativeToken: TokenList.CELO,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'arbitrum',
    nodeRpcs: {
      default: 'https://arb1.arbitrum.io/rpc',
    },
    nativeToken: TokenList.ETH,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'moonriver',
    nodeRpcs: {
      default: 'https://moonriver.api.onfinality.io/public',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'moonbeam',
    nodeRpcs: {
      default: 'https://rpc.api.moonbeam.network',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'gnosis',
    nodeRpcs: {
      default: 'https://rpc.gnosischain.com/',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'milkomeda',
    nodeRpcs: {
      default: 'https://rpc-mainnet-cardano-evm.c1.milkomeda.com',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'fuse',
    nodeRpcs: {
      default: 'https://rpc.fuse.io/',
    },
    nativeToken: TokenList.FUSE,
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'okxchain',
    nodeRpcs: {
      default: 'https://exchainrpc.okex.org',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'kcc',
    nodeRpcs: {
      default: 'https://rpc-mainnet.kcc.network',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'astar',
    nodeRpcs: {
      default: 'https://rpc.astar.network:8545',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'heco',
    nodeRpcs: {
      default: 'https://http-mainnet.hecochain.com',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'evmos',
    nodeRpcs: {
      default: 'https://eth.bd.evmos.org:8545/',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'iotex',
    nodeRpcs: {
      default: 'https://babel-api.mainnet.iotex.io',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'conflux',
    nodeRpcs: {
      default: 'https://evm.confluxrpc.com',
    },
    blockSubgraph: 'https://graphql.swappi.io/subgraphs/name/swappi-dex/swappi',
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'hoo',
    nodeRpcs: {
      default: 'https://http-mainnet.hoosmartchain.com',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'emerald',
    nodeRpcs: {
      default: 'https://emerald.oasis.dev',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'ronin',
    nodeRpcs: {
      default: '',
    },
    blockSubgraph: 'https://thegraph.roninchain.com/subgraphs/name/axieinfinity/ronin-blocks',
  },
  {
    network: 'mainnet',
    family: 'cosmos',
    name: 'cosmos',
    nodeRpcs: {
      default: 'api.cosmos.network',
    },
  },
  {
    network: 'mainnet',
    family: 'bitcore',
    name: 'litecoin',
    nodeRpcs: {
      default: `https://ltc.getblock.io/rest`,
    },
    nativeToken: TokenList.LTC,
  },
  {
    network: 'mainnet',
    family: 'tron',
    name: 'tron',
    nodeRpcs: {
      default: `https://api.trongrid.io/`,
    },
    nativeToken: TokenList.TRX,
  },
];

export function getChainConfig(name: string): ChainConfig {
  for (let i = 0; i < Blockchains.length; i++) {
    if (Blockchains[i].name === name) return Blockchains[i];
  }

  // default is ethereum
  return Blockchains[0];
}
