import { ConvexProtocolConfig } from '../../../../configs/protocols/convex';
import { ShareProviders } from '../../../../lib/types';

export async function queryLpStakingTransactions(
  config: ConvexProtocolConfig,
  providers: ShareProviders,
  fromTime: number,
  toTime: number
): Promise<Array<any>> {
  let data: Array<any> = [];

  // staking
  let startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				deposits(first: 1000, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
					id
					user {
						id
					}
					poolid {
						lpTokenUSDPrice
					}
					amount
					timestamp
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.curvePool, query);
    const deposits: Array<any> = response && response['deposits'] ? response['deposits'] : [];

    data = data.concat(deposits);

    if (deposits.length > 0) {
      startTime = deposits[deposits.length - 1] + 1;
    } else {
      break;
    }
  }

  // query LP withdrawals
  startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				withdrawals(first: 1000, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
					id
					user {
						id
					}
					poolid {
						lpTokenUSDPrice
					}
					amount
					timestamp
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.curvePool, query);
    const withdrawals: Array<any> = response && response['withdrawals'] ? response['withdrawals'] : [];
    data = data.concat(withdrawals);

    if (withdrawals.length > 0) {
      startTime = withdrawals[withdrawals.length - 1] + 1;
    } else {
      break;
    }
  }

  return data;
}

export async function queryCvxStakingTransactions(
  config: ConvexProtocolConfig,
  providers: ShareProviders,
  fromTime: number,
  toTime: number
): Promise<Array<any>> {
  let data: Array<any> = [];

  // staking
  let startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				deposits(first: 1000, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
					id
					contract {
						name
					}
					user {
						id
					}
					timestamp
					amount
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.staking, query);
    const deposits: Array<any> = response && response['deposits'] ? response['deposits'] : [];

    data = data.concat(deposits);

    if (deposits.length > 0) {
      startTime = deposits[deposits.length - 1] + 1;
    } else {
      break;
    }
  }

  // query LP withdrawals
  startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				withdrawals(first: 1000, where: {timestamp_gte: ${startTime}, timestamp_lte: ${toTime}}, orderBy: timestamp, orderDirection: asc) {
					id
					contract {
						name
					}
					user {
						id
					}
					timestamp
					amount
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.staking, query);
    const withdrawals: Array<any> = response && response['withdrawals'] ? response['withdrawals'] : [];
    data = data.concat(withdrawals);

    if (withdrawals.length > 0) {
      startTime = withdrawals[withdrawals.length - 1] + 1;
    } else {
      break;
    }
  }

  return data;
}

export async function queryCvxLockingTransactions(
  config: ConvexProtocolConfig,
  providers: ShareProviders,
  fromTime: number,
  toTime: number
): Promise<Array<any>> {
  let data: Array<any> = [];

  // staking
  let startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				locks(first: 1000, where: {time_gte: ${startTime}, time_lte: ${toTime}}, orderBy: time, orderDirection: asc) {
					id
					user {
						id
					}
					amountUSD
					time
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.locker, query);
    const deposits: Array<any> = response && response['locks'] ? response['locks'] : [];

    data = data.concat(deposits);

    if (deposits.length > 0) {
      startTime = deposits[deposits.length - 1] + 1;
    } else {
      break;
    }
  }

  // query LP withdrawals
  startTime = fromTime;
  while (startTime <= toTime) {
    const query = `
			{
				withdrawals(first: 1000, where: {time_gte: ${startTime}, time_lte: ${toTime}}, orderBy: time, orderDirection: asc) {
					id
					user {
						id
					}
					amountUSD
					time
				}
			}
		`;
    const response = await providers.subgraph.querySubgraph(config.subgraph.locker, query);
    const withdrawals: Array<any> = response && response['withdrawals'] ? response['withdrawals'] : [];
    data = data.concat(withdrawals);

    if (withdrawals.length > 0) {
      startTime = withdrawals[withdrawals.length - 1] + 1;
    } else {
      break;
    }
  }

  return data;
}
