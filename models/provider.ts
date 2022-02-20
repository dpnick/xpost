import { Integration, ProviderName } from '@prisma/client';
import { IntegrationInfos } from './integration';

export interface ProviderLib {
  [ProviderName.HASHNODE]: ProviderHelper;
  [ProviderName.DEV]: ProviderHelper;
  [ProviderName.MEDIUM]: ProviderHelper;
}

export interface ProviderHelper {
  init?: (params: { token: string; username: string }) => Promise<string>;
  getUserInfos: (params: Integration) => Promise<IntegrationInfos>;
  publishNewArticle: () => void;
}
