// import { Blockchains } from '../../core/constants/chains';
// import envConfig from '../../core/env';
// import { getTimestamp, getTodayUTCTimestamp, sleep } from '../../core/helper';
// import logger from '../../core/logger';
// import { ChainConfig, EnvConfig, ShareProviders } from '../../core/types';
// import BaseService from '../base';
// import { AggregatorProps, ChainDateData, CollectionProps } from './types';
//
// export class Aggregator extends BaseService {
//   public readonly name: string = 'blockchain.aggregator';
//   private _config: EnvConfig;
//   private _options: AggregatorProps;
//
//   constructor(providers: ShareProviders, options: AggregatorProps) {
//     super(providers);
//     this._config = envConfig;
//     this._options = options;
//   }
//
//   public async run(): Promise<void> {
//     const blockCollection = await this._providers.database.getCollection(
//       this._config.database.collections.blockchainBlockSync
//     );
//     const dailyDataCollection = await this._providers.database.getCollection(
//       this._config.database.collections.globalDataDaily
//     );
//     const dateDataCollection = await this._providers.database.getCollection(
//       this._config.database.collections.globalDataDate
//     );
//
//     while (true) {
//       const today = getTodayUTCTimestamp();
//       for (let i = 0; i < Blockchains.length; i++) {
//         // first, update daily data
//         const dailyData: ChainDateData = await Aggregator._summarizeBlockDataDaily(Blockchains[i], {
//           block: blockCollection,
//           daily: dailyDataCollection,
//           date: dateDataCollection,
//         });
//         await dailyDataCollection.updateOne(
//           {
//             module: dailyData.module,
//             chain: dailyData.chain,
//             network: dailyData.network,
//           },
//           {
//             $set: {
//               ...dailyData,
//             },
//           },
//           {
//             upsert: true,
//           }
//         );
//         logger.onInfo({
//           source: this.name,
//           message: 'updated daily data',
//           props: {
//             chain: dailyData.chain,
//           },
//         });
//
//         let startDate = this._options.initialDate;
//         if (!this._options.forceSync) {
//           // get state from database
//           const documents = await dateDataCollection
//             .find({
//               chain: Blockchains[i].name,
//               network: Blockchains[i].network,
//             })
//             .sort({ date: -1 })
//             .limit(1)
//             .toArray();
//           if (documents.length > 0) {
//             startDate = documents[i].date;
//           }
//         }
//
//         while (startDate <= today) {
//           const dateData: ChainDateData = await Aggregator._summarizeBlockDataDate(
//             Blockchains[i],
//             {
//               block: blockCollection,
//               daily: dailyDataCollection,
//               date: dateDataCollection,
//             },
//             startDate
//           );
//           await dateDataCollection.updateOne(
//             {
//               module: dailyData.module,
//               chain: dailyData.chain,
//               network: dailyData.network,
//               date: today,
//             },
//             {
//               $set: {
//                 ...dateData,
//               },
//             },
//             {
//               upsert: true,
//             }
//           );
//           logger.onInfo({
//             source: this.name,
//             message: 'updated date data',
//             props: {
//               chain: dailyData.chain,
//               date: new Date(startDate * 1000).toISOString().split('T')[0],
//             },
//           });
//
//           startDate += 24 * 60 * 60;
//         }
//       }
//
//       await sleep(10 * 60); // sleep 10 minutes
//     }
//   }
//
//   public static async _summarizeBlockDataDate(
//     chain: ChainConfig,
//     collections: CollectionProps,
//     startDateTimestamp: number
//   ): Promise<ChainDateData> {
//     const dateTimestamp = startDateTimestamp;
//     const endDateTimestamp = dateTimestamp + 24 * 60 * 60;
//     return await Aggregator._summarizeBlockDataRange(
//       chain,
//       collections,
//       dateTimestamp,
//       endDateTimestamp,
//       dateTimestamp
//     );
//   }
//
//   private static async _summarizeBlockDataDaily(
//     chain: ChainConfig,
//     collections: CollectionProps
//   ): Promise<ChainDateData> {
//     const currentTimeTimestamp = getTimestamp();
//     const last24HoursTimestamp = currentTimeTimestamp - 24 * 60 * 60;
//     return await Aggregator._summarizeBlockDataRange(
//       chain,
//       collections,
//       last24HoursTimestamp,
//       currentTimeTimestamp,
//       currentTimeTimestamp
//     );
//   }
//
//   private static async _summarizeBlockDataRange(
//     chain: ChainConfig,
//     collections: CollectionProps,
//     fromTime: number,
//     toTime: number,
//     theDate: number
//   ): Promise<ChainDateData> {
//     const blocks = await collections.block
//       .find({
//         chain: chain.name,
//         network: chain.network,
//         timestamp: {
//           $gte: fromTime,
//           $lt: toTime,
//         },
//       })
//       .sort({ blockNumber: 1 })
//       .toArray();
//
//     const data: ChainDateData = {
//       module: 'blockchain',
//       date: theDate,
//
//       chain: chain.name,
//       network: chain.network,
//
//       uniqueAddress: 0,
//       totalTransaction: 0,
//       transferVolume: 0,
//     };
//
//     const addresses: any = {};
//     for (let i = 0; i < blocks.length; i++) {
//       data.transferVolume += blocks[i].volumeNative;
//       data.totalTransaction += blocks[i].transactionCount;
//
//       for (let addressIdx = 0; addressIdx < blocks[i].addresses.length; addressIdx++) {
//         if (!addresses[blocks[i].addresses[addressIdx]]) {
//           data.uniqueAddress += 1;
//           addresses[blocks[i].addresses[addressIdx]] = true;
//         }
//       }
//     }
//
//     return data;
//   }
// }
