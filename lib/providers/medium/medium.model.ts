export interface MediumUser {
  id: string;
  username: string;
  name: string;
  url: string;
  imageUrl: string;
}

export interface MediumRssFeed {
  status: string;
  feed: MediumFeed;
  items: MediumFeedPost[];
}

export interface MediumFeed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

export interface MediumFeedPost {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Record<string, unknown>;
  categories: string[];
}

export interface MediumPost {
  id: string;
  title: string;
  authorId: string;
  tags: string[];
  url: string;
  canonicalUrl: string;
  publishStatus: string;
  publishedAt: number;
  license: string;
  licenseUrl: string;
}

export interface MediumNewPost {
  title: string;
  content: string;
  contentFormat: string;
  tags: string[];
  canonicalUrl?: string;
  publishStatus: MediumPublishStatus;
  notifyFollowers: boolean;
}

export const enum MediumPublishStatus {
  PUBLIC = 'public',
  DRAFT = 'draft',
  UNLISTED = 'unlisted'
}