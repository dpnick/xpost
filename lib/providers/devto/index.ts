import fetchJson from '@lib/fetchJson';
import { IntegrationInfos } from '@models/integration';
import { SelectOption } from '@models/selectOption';
import { Integration, Post, Provider, Publication } from '@prisma/client';

const DEVT0_URL = 'https://dev.to/api';

interface DevtoArticle {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  public_reactions_count: number;
  url: string;
}

interface ArticleToCreate {
  article: {
    title: string;
    published: boolean;
    body_markdown: string;
    main_image: string;
    canonical_url?: string;
    tags: string[];
    series?: string;
  };
}

function init({
  token,
}: {
  token: string;
  username?: string;
}): Promise<Partial<Integration>> {
  return fetchJson<{
    id: number;
    username: string;
  }>(`${DEVT0_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': token,
    },
  }).then((user) => {
    return { username: user.username };
  });
}

function getUserInfos({ id, token }: Integration): Promise<IntegrationInfos> {
  const numberOfFollowers = fetchJson<{ id: number; username: string }[]>(
    `${DEVT0_URL}/followers/users?per_page=1000`,
    {
      method: 'GET',
      headers: {
        'api-key': token,
      },
    }
  ).then((followers) => followers?.length);
  const infosFromArticles = fetchJson<DevtoArticle[]>(
    `${DEVT0_URL}/articles/me/published?per_page=1000`,
    {
      method: 'GET',
      headers: {
        'api-key': token,
      },
    }
  ).then((articles) => {
    // compute each articles to get desired infos
    const postsCount = articles?.length;
    const reactionsCount = articles?.reduce(
      (prev, cur) => prev + cur.public_reactions_count,
      0
    );
    return {
      integrationId: id,
      followersCount: undefined,
      postsCount,
      reactionsCount,
    };
  });

  return Promise.all([numberOfFollowers, infosFromArticles]).then(
    ([numFollowers, infosFromArticles]) => ({
      ...infosFromArticles,
      followersCount: numFollowers,
    })
  );
}

function publishNewArticle(
  post: Post,
  tags: SelectOption[],
  integration: Integration & { provider: Provider },
  originalUrl?: string
): Promise<Omit<Publication, 'id'>> {
  const devTags = tags?.map((tag) => tag.label.split(' ').join(''));
  const input: ArticleToCreate = {
    article: {
      title: post.title!,
      main_image: post.cover!,
      published: true,
      body_markdown: post.content!,
      tags: devTags ?? [],
    },
  };

  if (originalUrl) {
    input.article.canonical_url = originalUrl;
  }

  return fetchJson<DevtoArticle>(`${DEVT0_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': integration.token,
    },
    body: JSON.stringify(input),
  })
    .then(({ url }) => {
      const publication: Omit<Publication, 'id'> = {
        publishedAt: new Date(),
        url,
        postId: post.id,
        integrationId: integration.id,
        isCanonical: !originalUrl,
      };
      return publication;
    })
    .catch((error) => {
      let message = String(error);
      if (error instanceof Error) message = error.message;
      throw new Error(message ?? 'An error occured publishing on dev.to');
    });
}

export { init, getUserInfos, publishNewArticle };
