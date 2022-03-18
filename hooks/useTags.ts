import fetchJson from '@lib/fetchJson';
import { Tag } from '@models/tag';
import useSWRImmutable, { Fetcher } from 'swr';

export default function usePosts() {
  const tagFetch: Fetcher<Tag[]> = getHashnodeTags;
  const { data, error } = useSWRImmutable('api/tags', tagFetch);

  function getHashnodeTags() {
    return fetchJson<{
      data: { tagCategories: Tag[] };
      errors: [{ message: string }];
    }>('https://api.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
              tagCategories {
                  _id
                  name
                }
          }
        `,
      }),
    })
      .then(({ data, errors }) => {
        if (errors) {
          throw new Error(errors[0]?.message ?? 'An error occured');
        }
        return data.tagCategories;
      })
      .catch(() => {
        throw new Error('An error occured');
      });
  }

  return {
    tags: data,
    isLoading: !error && !data,
    isError: error,
  };
}
