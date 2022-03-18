import {
  Integration,
  Post,
  Provider,
  ProviderName,
  Publication,
} from '@prisma/client';
import { IntegrationInfos } from './integration';
import { SelectOption } from './selectOption';

export interface ProviderFactory {
  [ProviderName.HASHNODE]: ProviderFunctions;
  [ProviderName.DEV]: ProviderFunctions;
  [ProviderName.MEDIUM]: ProviderFunctions;
}

export interface ProviderFunctions {
  init: (params: {
    token: string;
    username?: string;
  }) => Promise<Partial<Integration>>;
  getUserInfos: (params: Integration) => Promise<IntegrationInfos>;
  publishNewArticle: (
    post: Post,
    tags: SelectOption[],
    integration: Integration & { provider: Provider },
    originalUrl?: string
  ) => Promise<Omit<Publication, 'id'>>;
}
