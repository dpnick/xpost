import { ProviderLib } from '@models/provider';
import { ProviderName } from '@prisma/client';
import * as hashnodeFunctions from './hashnode';

// TODO:
const providers: ProviderLib = {
  [ProviderName.HASHNODE]: hashnodeFunctions,
  [ProviderName.DEV]: hashnodeFunctions,
  [ProviderName.MEDIUM]: hashnodeFunctions,
};

export default providers;
