import Box from '@components/Box';
import Collapse from '@components/Collapse';
import Modal from '@components/Modal';
import PublishModal from '@components/PublishModal';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import React, { useState } from 'react';
import DraftCard from './DraftCard';
import ListHeader from './ListHeader';
import PublishedCard from './PublishedCard';

interface PostListProps {
  title: string;
  headerAction?: React.ReactNode;
  posts: Post[] | (Post & { publications: Publication[] })[];
  integrations: (Integration & { provider: Provider })[];
  isDraft?: boolean;
}

export default function PostList({
  title,
  headerAction,
  posts,
  integrations,
  isDraft,
}: PostListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const toggleOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const selectPost = (post: Post) => setSelectedPost(post);
  const hidePublishModal = () => setSelectedPost(null);

  const renderDraft = (
    <>
      {selectedPost && (
        <Modal onClose={hidePublishModal}>
          <PublishModal
            post={selectedPost}
            integrations={integrations}
            onClose={hidePublishModal}
          />
        </Modal>
      )}
      {posts?.map((post) => (
        <DraftCard key={post.id} draft={post} selectPost={selectPost} />
      ))}
    </>
  );

  const renderPublished = (
    <>
      {posts?.map((post) => (
        <PublishedCard
          key={post.id}
          post={post as Post & { publications: Publication[] }}
          integrations={integrations}
        />
      ))}
    </>
  );

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
            isDraft ? (
              renderDraft
            ) : (
              renderPublished
            )
          ) : (
            <p>Nothing to display yet</p>
          )}
        </Box>
      </Collapse>
    </>
  );
}
