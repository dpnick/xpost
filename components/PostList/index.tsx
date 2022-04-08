import Box from '@components/Box';
import Collapse from '@components/Collapse';
import Text from '@components/Text';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import { RiGhostLine } from 'react-icons/ri';
import DraftCard from './DraftCard';
import ListHeader from './ListHeader';
import PublishedCard from './PublishedCard';
import ScheduledCard from './ScheduledCard';

interface PostListProps {
  title: string;
  headerAction?: React.ReactNode;
  posts: Post[] | (Post & { publications: Publication[] })[];
  integrations: (Integration & { provider: Provider })[];
  isDraft?: boolean;
  isScheduled?: boolean;
  selectPostToPublish?: (post: Post) => void;
}

export default function PostList({
  title,
  headerAction,
  posts,
  integrations,
  isDraft,
  isScheduled,
  selectPostToPublish,
}: PostListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const renderList = useCallback(() => {
    if (isDraft) {
      return posts?.map((post) => (
        <DraftCard
          key={post.id}
          draft={post}
          selectPost={selectPostToPublish!}
        />
      ));
    }
    if (isScheduled) {
      return posts?.map((post) => (
        <ScheduledCard
          key={post.id}
          post={post as Post & { publications: Publication[] }}
        />
      ));
    }
    return posts?.map((post) => (
      <PublishedCard
        key={post.id}
        post={post as Post & { publications: Publication[] }}
        integrations={integrations}
      />
    ));
  }, [isDraft, isScheduled, posts, selectPostToPublish, integrations]);

  return (
    <>
      <ListHeader
        isOpen={isOpen}
        title={title}
        toggleOpening={toggleOpening}
        headerAction={headerAction}
      />
      <Collapse isOpen={isOpen}>
        <Box padding='16px'>
          {posts?.length > 0 ? (
            renderList()
          ) : (
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='column'
              py={3}
            >
              <RiGhostLine size={48} color='black' />
              <Text mt={3} color='gray.500' textAlign='center'>
                Nothing to display yet,{' '}
                {isDraft
                  ? 'add a new draft to see it appears here!'
                  : isScheduled
                  ? 'your scheduled posts will appear here!'
                  : 'as soon as you publish an article, you can find it here!'}
              </Text>
            </Box>
          )}
        </Box>
      </Collapse>
    </>
  );
}
