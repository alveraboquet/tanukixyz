import axios from 'axios';

import logger from '../core/logger';
import { Provider } from '../core/namespaces';

class GraphProvider implements Provider {
  public readonly name: string = 'provider.graph';

  constructor() {}

  public async querySubgraph(endpoint: string, query: string): Promise<any> {
    try {
      const response = await axios.post(
        endpoint,
        {
          query: query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.errors) {
        logger.onWarn({
          source: this.name,
          message: 'got errors from subgraph',
          props: {
            errors: JSON.stringify(response.data.errors),
            endpoint: endpoint,
            query: query,
          },
        });
      }

      return response.data.data;
    } catch (e: any) {
      logger.onError({
        source: this.name,
        message: 'failed to query subgraph',
        props: {
          endpoint: endpoint,
          query: query,
          error: e.message,
        },
      });
      return null;
    }
  }

  public async queryMetaLatestBlock(endpoint: string): Promise<number> {
    const response = await this.querySubgraph(
      endpoint,
      `
			{
				_meta {
					block {
					  number
          }
				}
			}
		`
    );
    if (response) return Number(response['_meta'].block.number);
    return 0;
  }

  public async queryBlockAtTimestamp(endpoint: string, timestamp: number): Promise<number> {
    const blocks = await this.querySubgraph(
      endpoint,
      `
			{
				blocks(where: {timestamp_lte: ${timestamp}}, first: 1, orderBy: timestamp, orderDirection: desc) {
					number
				}
			}
		`
    );

    if (blocks.blocks.length > 0) return Number(blocks.blocks[0].number);
    else return 0;
  }
}

export default GraphProvider;
