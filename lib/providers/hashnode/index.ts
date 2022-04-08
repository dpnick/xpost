import fetchJson from '@lib/fetchJson';
import { IntegrationInfos } from '@models/integration';
import { SelectOption } from '@models/selectOption';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import GET_INFOS from './queries/getInfos';
import GET_PUBLICATION_ID from './queries/getPublicationId';
import PUBLISH_ARTICLE from './queries/publishArticle';

const HASHNODE_URL = 'https://api.hashnode.com/';

interface PublishInput {
  title: string;
  slug: string;
  coverImageURL: string;
  contentMarkdown: string;
  tags: { _id: string }[];
  isRepublished?: { originalArticleURL: string };
}

function init({
  token,
  username,
}: {
  token: string;
  username?: string;
}): Promise<Partial<Integration>> {
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
    const { publication } = data?.user;
    return { publicationId: publication?._id };
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

function publishNewArticle(
  post: Post,
  tags: SelectOption[],
  integration: Integration & { provider: Provider },
  originalUrl?: string
): Promise<Omit<Publication, 'id'>> {
  const hashnodeCompatibleTags: { _id: string }[] = tags
    ?.filter((tag) => !tag.__isNew__)
    ?.map((post) => ({
      _id: post.value,
    }));

  const input: PublishInput = {
    title: post.title!,
    slug: post.slug!,
    coverImageURL: post.cover!,
    contentMarkdown: post.content!,
    tags:
      hashnodeCompatibleTags?.length > 0
        ? hashnodeCompatibleTags
        : [
            { _id: '56744721958ef13879b94ae7' },
            { _id: '56744723958ef13879b952d7' },
          ],
  };

  if (originalUrl) {
    input.isRepublished = {
      originalArticleURL: originalUrl,
    };
  }
  const publicationId = integration.publicationId;
  const variables = { input, publicationId };

  return fetchJson<{
    data: {
      createPublicationStory: {
        post: {
          slug: string;
          publication: { domain: string };
          author: { blogHandle: string };
        };
      };
    };
    errors: [{ message: string }];
  }>(HASHNODE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: integration.token,
    },
    body: JSON.stringify({
      query: PUBLISH_ARTICLE,
      variables,
    }),
  }).then(({ data, errors }) => {
    if (errors) {
      throw new Error(errors[0]?.message ?? 'An error occured');
    }
    const slug = data?.createPublicationStory?.post?.slug;
    const domain = data?.createPublicationStory?.post?.publication?.domain;
    const blogHandle = data?.createPublicationStory?.post?.author?.blogHandle;
    const customDomain =
      domain ?? `${blogHandle ?? integration.username}.hashnode.dev`;

    const publication: Omit<Publication, 'id'> = {
      publishedAt: new Date(),
      url: `https://${customDomain}/${slug}`,
      postId: post.id,
      integrationId: integration.id,
      isCanonical: !originalUrl,
    };
    return publication;
  });
}

export { init, getUserInfos, publishNewArticle };
