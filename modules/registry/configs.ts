import { CompoundConfigs } from '../../configs/protocols/compound';
import { CompoundRegistryProvider } from './providers/compound/compound';
import RegistryProvider from './providers/registry';

export const Registries: { [key: string]: RegistryProvider } = {
  compound: new CompoundRegistryProvider(CompoundConfigs),
};
