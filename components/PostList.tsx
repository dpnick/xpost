import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { EMPTY_IMG } from 'pages/dashboard';
import React from 'react';
import styled from 'styled-components';
import Box from './Box';
import Text from './Text';

interface PostListProps {
  posts: Post[];
}

const PostCard = styled(Box)`
  margin: 8px 0;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts?.length > 0 ? (
        posts?.map((post) => (
          <Link
            key={post.id}
            href={{
              pathname: `dashboard/post/[id]`,
              query: { id: post.id, isPublished: post.published },
            }}
          >
            <PostCard className={styles.clickableCard}>
              <Box position='relative' width={50} height={50} flexShrink={0}>
                <Image src={post?.cover ?? EMPTY_IMG} layout='fill' />
              </Box>

              <Text
                paddingX='16px'
                overflow='hidden'
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {post.title}
              </Text>
              <Box flexShrink={0}>{post.createdAt}</Box>
            </PostCard>
          </Link>
        ))
      ) : (
        <p>Nothing to display yet</p>
      )}
    </>
  );
}
