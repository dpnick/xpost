import fetchSwr from '@lib/fetchSwr';
import { DailyDevItem } from '@models/dailyDevItem';
import useSWRImmutable, { Fetcher } from 'swr';

export default function useBookmarks() {
  const fetch: Fetcher<{ bookmarks: DailyDevItem[]; tags: string[] }> =
    fetchSwr;
  const { data, error, mutate } = useSWRImmutable(
    '/api/user/get-bookmarks',
    fetch
  );

  return {
    bookmarks: data?.bookmarks,
    tags: data?.tags,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
