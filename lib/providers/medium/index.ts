import fetchJson from '@lib/fetchJson';
import { IntegrationInfos } from '@models/integration';
import { SelectOption } from '@models/selectOption';
import { Integration, Post, Publication } from '@prisma/client';
import { MediumNewPost, MediumPost, MediumPublishStatus, MediumRssFeed, MediumUser } from './medium.model';

const MEDIUM_API_URL = 'https://api.medium.com/v1';

const getRequestHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'User-Agent': '*'
});

const createMediumPostBody = (post: Post, tags: string[], originalUrl?: string): string => {
  const body: MediumNewPost = {
    title: post.title!,
    contentFormat: 'markdown',
    content: post.content!,
    tags,
    publishStatus: MediumPublishStatus.PUBLIC,
    notifyFollowers: true
  };

  if (originalUrl) {
    body.canonicalUrl = originalUrl
  }

  return JSON.stringify(body);
};

function init({ token }: { token: string }): Promise<Partial<Integration>> {
  return fetchJson<{ data: MediumUser }>(
    `${MEDIUM_API_URL}/me`,
    {
      method: 'GET',
      headers: getRequestHeaders(token),
    }
  ).then(response => ({
    username: response.data.username,
    publicationId: response.data.id
  }));
}

function getUserInfos({ id, username }: Integration): Promise<IntegrationInfos> {
  return fetchJson<MediumRssFeed>(
    `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`,
    { method: 'GET' }
  ).then(response => ({
    integrationId: id,
    followersCount: undefined,
    postsCount: response.items.length,
    reactionsCount: undefined
  }));
}

function publishNewArticle(
  post: Post,
  tags: SelectOption[],
  integration: Integration,
  originalUrl?: string
): Promise<Omit<Publication, 'id'>> {
  const devTags = tags?.map(tag => tag.label.split(' ').join(''));

  return fetchJson<{ data: MediumPost }>(
    `${MEDIUM_API_URL}/users/${integration.publicationId}/posts`,
    {
      method: 'POST',
      headers: getRequestHeaders(integration.token),
      body: createMediumPostBody(post, devTags, originalUrl)
    }
  ).then(response => ({
    publishedAt: new Date(String(response.data.publishedAt)),
    url: response.data.url,
    postId: response.data.id,
    integrationId: integration.id,
    isCanonical: !originalUrl
  })).catch(error => {
    let message = String(error);
    if (error instanceof Error) message = error.message;
    throw new Error(message ?? 'An error occured publishing on dev.to');
  });
}

export { init, getUserInfos, publishNewArticle };
