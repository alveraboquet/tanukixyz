import { EventIndexConfig } from '../../../configs/types';
import { ShareProviders } from '../../../lib/types';
import { CompoundIndexerHook } from './compound/compound';
import IndexerHook from './hook';

export function getHook(protocol: string, providers: ShareProviders, config: EventIndexConfig): IndexerHook | null {
  switch (protocol) {
    case 'compound':
      return new CompoundIndexerHook('compound', providers, config);
    case 'ironbank':
      return new CompoundIndexerHook('ironbank', providers, config);
    case 'venus':
      return new CompoundIndexerHook('venus', providers, config);
    case 'cream':
      return new CompoundIndexerHook('cream', providers, config);
    case 'traderjoe':
      return new CompoundIndexerHook('traderjoe', providers, config);
    case 'benqi':
      return new CompoundIndexerHook('benqi', providers, config);
    case 'bastion':
      return new CompoundIndexerHook('bastion', providers, config);
    case 'aurigami':
      return new CompoundIndexerHook('aurigami', providers, config);
    default:
      return null;
  }
}
