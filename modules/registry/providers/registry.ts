import envConfig from '../../../configs/env';
import { RegistryProtocolConfig } from '../../../configs/types';
import logger from '../../../lib/logger';
import { Provider, RegistryAddressData, ShareProviders } from '../../../lib/types';

export interface StartRegistryServiceProps {
  providers: ShareProviders;
}

class RegistryProvider implements Provider {
  public readonly name: string = 'provider.registry';

  public readonly configs: any;

  constructor(configs: any) {
    this.configs = configs;
  }

  public async getAllAddressInfo(providers: ShareProviders): Promise<Array<RegistryAddressData>> {
    return [];
  }

  public async startService(props: StartRegistryServiceProps): Promise<void> {
    const { providers } = props;

    const startExeTime = new Date().getTime();

    logger.onInfo({
      source: this.name,
      message: 'collecting address registry data',
      props: {
        name: (this.configs as RegistryProtocolConfig).name,
      },
    });

    const addressRegistryCollection = await providers.database.getCollection(
      envConfig.database.collections.globalRegistryAddresses
    );

    // for every protocol, we default collect data from the beginning
    const addresses: Array<RegistryAddressData> = await this.getAllAddressInfo(providers);

    const operations: Array<any> = [];
    for (let i = 0; i < addresses.length; i++) {
      operations.push({
        updateOne: {
          filter: {
            chain: addresses[i].chain,
            address: addresses[i].address,
          },
          update: {
            $set: {
              protocols: {
                [this.configs.name]: {
                  ...addresses[i].protocols[this.configs.name],
                },
              },
            },
          },
          upsert: true,
        },
      });
    }

    if (operations.length > 0) {
      await addressRegistryCollection.bulkWrite(operations);
    }

    const endExeTime = new Date().getTime();
    const elapsed = (endExeTime - startExeTime) / 1000;
    logger.onInfo({
      source: this.name,
      message: `collected ${operations.length} addresses data`,
      props: {
        name: this.configs.name,
        elapsed: `${elapsed.toFixed(2)}s`,
      },
    });
  }
}

export default RegistryProvider;
