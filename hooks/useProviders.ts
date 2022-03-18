import fetchSwr from '@lib/fetchSwr';
import { Integration, Provider } from '@prisma/client';
import useSWRImmutable, { Fetcher } from 'swr';

export default function useProviders() {
  const providerFetch: Fetcher<{
    providers: Provider[];
    integrations: (Integration & { provider: Provider })[];
  }> = fetchSwr;
  const { data, error, mutate } = useSWRImmutable(
    '/api/provider/get-providers',
    providerFetch
  );

  return {
    providers: data?.providers,
    integrations: data?.integrations,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
