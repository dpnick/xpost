import fetchJson from '@lib/fetchJson';
import { IntegrationInfos } from '@models/integration';
import { Integration } from '@prisma/client';
import GET_INFOS from './query/getInfos';
import GET_PUBLICATION_ID from './query/getPublicationId';

const HASHNODE_URL = 'https://api.hashnode.com/';

function init({ token, username }: { token: string; username: string }) {
  // get hashnode publicationId
  // mandatory to be able to publish
  const variables = { username };
  return fetchJson<{
    data: { user: { publication: { _id: string } } };
    errors: [{ message: string }];
  }>(HASHNODE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      query: GET_PUBLICATION_ID,
      variables,
    }),
  }).then(({ data, errors }) => {
    if (errors) {
      throw new Error(errors[0]?.message ?? 'An error occured');
    }
    return data?.user?.publication?._id;
  });
}

function getUserInfos({
  id,
  token,
  username,
}: Integration): Promise<IntegrationInfos> {
  const variables = { username };
  return fetchJson<{
    data: {
      user: { numReactions: number; numFollowers: number; numPosts: number };
    };
    errors: [{ message: string }];
  }>(HASHNODE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      query: GET_INFOS,
      variables,
    }),
  }).then(({ data, errors }) => {
    if (errors) {
      throw new Error(errors[0]?.message ?? 'An error occured');
    }
    const {
      numFollowers: followersCount,
      numPosts: postsCount,
      numReactions: reactionsCount,
    } = data?.user;
    return { integrationId: id, followersCount, postsCount, reactionsCount };
  });
}

function publishNewArticle() {}

export { init, getUserInfos, publishNewArticle };
