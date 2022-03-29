import { ProviderFactory } from '@models/provider';
import { ProviderName } from '@prisma/client';
import * as devtoFunctions from './devto';
import * as hashnodeFunctions from './hashnode';
import * as mediumFunctions from './medium';

const providers: ProviderFactory = {
  [ProviderName.HASHNODE]: hashnodeFunctions,
  [ProviderName.DEV]: devtoFunctions,
  [ProviderName.MEDIUM]: mediumFunctions,
};

export default providers;
