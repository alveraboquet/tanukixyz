import { AnkrPublicNodes } from './constants/ankrPublicNodes';
import { BlockSubgraphs } from './constants/blockSubgraphs';
import envConfig from './env';
import { ChainConfig } from './types';

const ALCHEMY_KEY = envConfig.apiKeys.alchemy;
const NODEREAL_KEY = envConfig.apiKeys.nodereal;

export const Blockchains: Array<ChainConfig> = [
  {
    network: 'mainnet',
    family: 'evm',
    name: 'ethereum',
    nodeRpcs: {
      default: AnkrPublicNodes.ethereum, // should be public rpc
      archive: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.ethereum,
    },
  },
  {
    network: 'mainnet',
    family: 'bitcore',
    name: 'bitcoin',
    nodeRpcs: {
      default: 'https://btc.getblock.io/rest',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'avalanche',
    nodeRpcs: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
      archive: AnkrPublicNodes.avalanche,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.avalanche,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'polygon',
    nodeRpcs: {
      default: AnkrPublicNodes.polygon,
      archive: 'https://matic-mainnet.chainstacklabs.com',
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.polygon,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'fantom',
    nodeRpcs: {
      default: AnkrPublicNodes.fantom,
      archive: AnkrPublicNodes.fantom,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.fantom,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'binance',
    nodeRpcs: {
      default: 'https://bscrpc.com',
      archive: `https://bsc-mainnet.nodereal.io/v1/${NODEREAL_KEY}`,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.binance,
    },
  },
  {
    network: 'mainnet',
    family: 'near',
    name: 'near',
    nodeRpcs: {
      default: 'https://archival-rpc.mainnet.near.org',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'harmony',
    nodeRpcs: {
      default: 'https://api.harmony.one',
      archive: 'https://api.harmony.one',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'aurora',
    nodeRpcs: {
      default: 'https://mainnet.aurora.dev/',
      archive: 'https://mainnet.aurora.dev/',
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'cronos',
    nodeRpcs: {
      default: 'https://evm.cronos.org',
      archive: 'https://evm.cronos.org',
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.cronos,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'ronin',
    nodeRpcs: {
      default: '',
      archive: '',
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.ronin,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'celo',
    nodeRpcs: {
      default: AnkrPublicNodes.celo,
      archive: 'https://forno.celo.org',
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.celo,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'arbitrum',
    nodeRpcs: {
      default: 'https://arb1.arbitrum.io/rpc',
      archive: AnkrPublicNodes.arbitrum,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.arbitrum,
    },
  },
  {
    network: 'mainnet',
    family: 'evm',
    name: 'optimism',
    nodeRpcs: {
      default: AnkrPublicNodes.optimism,
      archive: AnkrPublicNodes.optimism,
    },
    subgraph: {
      blockSubgraph: BlockSubgraphs.optimism,
    },
  },
  {
    network: 'mainnet',
    family: 'bitcore',
    name: 'litecoin',
    nodeRpcs: {
      default: 'https://ltc.getblock.io/rest',
    },
  },
  {
    network: 'mainnet',
    family: 'tron',
    name: 'tron',
    nodeRpcs: {
      default: 'https://api.trongrid.io/',
    },
  },
];

export function getChainConfig(name: string): ChainConfig {
  for (let i = 0; i < Blockchains.length; i++) {
    if (Blockchains[i].name === name) return Blockchains[i];
  }

  // default is ethereum
  return Blockchains[0];
}
