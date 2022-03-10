import fetchSwr from '@lib/fetchSwr';
import { Post } from '@prisma/client';
import useSWRImmutable, { Fetcher } from 'swr';

export default function usePosts(selectedId?: string) {
  const postFetch: Fetcher<Post[]> = fetchSwr;
  const { data, error, mutate } = useSWRImmutable(
    '/api/post/get-by-user',
    postFetch
  );

  return {
    posts: data,
    selectedPost: data?.find(({ id }) => id === selectedId),
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
