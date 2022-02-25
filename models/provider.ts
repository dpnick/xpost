import {
  Integration,
  Post,
  Provider,
  ProviderName,
  Publication,
} from '@prisma/client';
import { IntegrationInfos } from './integration';

export interface ProviderLib {
  [ProviderName.HASHNODE]: ProviderHelper;
  [ProviderName.DEV]: ProviderHelper;
  [ProviderName.MEDIUM]: ProviderHelper;
}

export interface ProviderHelper {
  init: (params: {
    token: string;
    username?: string;
  }) => Promise<Partial<Integration>>;
  getUserInfos: (params: Integration) => Promise<IntegrationInfos>;
  publishNewArticle: (
    post: Post,
    integration: Integration & { provider: Provider },
    originalUrl?: string
  ) => Promise<Omit<Publication, 'id'>>;
}
