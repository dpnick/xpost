import fetchSwr from '@lib/fetchSwr';
import { User } from '@prisma/client';
import useSWRImmutable, { Fetcher } from 'swr';

export default function usePosts() {
  const fetch: Fetcher<User> = fetchSwr;
  const { data, error, mutate } = useSWRImmutable('/api/user/get-infos', fetch);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
