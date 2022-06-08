import { getTimestamp } from '../../core/helper';
import { ChainConfig } from '../../core/types';
import { ChainDateData, CollectionProps } from './types';

async function summarizeBlockDataRange(
  chain: ChainConfig,
  collections: CollectionProps,
  fromTime: number,
  toTime: number,
  theDate: number
): Promise<ChainDateData> {
  const blocks = await collections.block
    .find({
      chain: chain.name,
      network: chain.network,
      timestamp: {
        $gte: fromTime,
        $lt: toTime,
      },
    })
    .toArray();

  const data: ChainDateData = {
    module: 'blockchain',
    date: theDate,

    chain: chain.name,
    network: chain.network,

    uniqueAddress: 0,
    totalTransaction: 0,
    transferVolume: 0,
  };

  const addresses: any = {};
  for (let i = 0; i < blocks.length; i++) {
    data.transferVolume += blocks[i].volume;
    data.totalTransaction += blocks[i].totalTxn;

    for (let addressIdx = 0; addressIdx < blocks[i].uniqueAddress.length; addressIdx++) {
      if (!addresses[blocks[i].uniqueAddress[addressIdx]]) {
        data.uniqueAddress += 1;
        addresses[blocks[i].uniqueAddress[addressIdx]] = true;
      }
    }
  }

  return data;
}

export async function summarizeBlockDataDate(
  chain: ChainConfig,
  collections: CollectionProps,
  startDateTimestamp: number
): Promise<ChainDateData> {
  const dateTimestamp = startDateTimestamp;
  const endDateTimestamp = dateTimestamp + 24 * 60 * 60;
  return await summarizeBlockDataRange(chain, collections, dateTimestamp, endDateTimestamp, dateTimestamp);
}

export async function summarizeBlockDataDaily(
  chain: ChainConfig,
  collections: CollectionProps
): Promise<ChainDateData> {
  const currentTimeTimestamp = getTimestamp();
  const last24HoursTimestamp = currentTimeTimestamp - 24 * 60 * 60;
  return await summarizeBlockDataRange(
    chain,
    collections,
    last24HoursTimestamp,
    currentTimeTimestamp,
    currentTimeTimestamp
  );
}
