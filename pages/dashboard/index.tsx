import Box from '@components/Box';
import Button from '@components/Button';
import Footer from '@components/Footer';
import Modal from '@components/Modal';
import PostList from '@components/PostList';
import ProviderList from '@components/ProviderList';
import PublishModal from '@components/PublishModal';
import Spinner from '@components/Spinner';
import usePosts from '@hooks/usePosts';
import useProviders from '@hooks/useProviders';
import fetchJson from '@lib/fetchJson';
import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import router from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoAddSharp } from 'react-icons/io5';
import styled from 'styled-components';

export const EMPTY_IMG = '/images/no_cover.png';
export const PROD_URL = 'https://xpost.netlify.app';

const AddButton = styled(Button)`
  margin-right: 16px;
`;

export default function Dashboard() {
  const [postToPublish, setPostToPublish] = useState<Post | null>(null);
  const { posts, isLoading: postsLoading } = usePosts();
  const {
    integrations,
    providers,
    isLoading: providersLoading,
  } = useProviders();

  const createNewDraft = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    try {
      const newPost: Post = await fetchJson(
        '/api/post/create',
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
        },
        true
      );

      router.push({
        pathname: `dashboard/post/${newPost.id}`,
        query: { isPublished: false },
      });
    } catch {
      toast.error('Please contact our support');
    }
  };

  const selectPostToPublish = (post: Post) => setPostToPublish(post);
  const hidePublishModal = () => setPostToPublish(null);

  if (postsLoading || providersLoading) {
    return (
      <Box
        width='100%'
        height='100vh'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      {postToPublish && (
        <Modal
          open={!!postToPublish}
          onChange={hidePublishModal}
          content={
            <PublishModal
              post={postToPublish}
              integrations={integrations ?? []}
            />
          }
        />
      )}
      <Box width='100%' bg='white'>
        <Box minHeight='calc(100vh - 80px - 180px)' px='3vw' pb='10vh' pt='8px'>
          <h3>Providers</h3>
          <ProviderList providers={providers!} integrations={integrations!} />
          <h3>Posts</h3>
          <Box p={0} mt='32px' className={styles.card}>
            <PostList
              isDraft
              selectPostToPublish={selectPostToPublish}
              posts={posts ? posts?.filter(({ published }) => !published) : []}
              integrations={integrations!}
              title={`Drafts (${
                posts?.filter(({ published }) => !published)?.length
              })`}
              headerAction={
                <AddButton
                  label='New'
                  Icon={IoAddSharp}
                  onClick={createNewDraft}
                />
              }
            />
          </Box>
          <Box p={0} mt='16px' className={styles.card}>
            <PostList
              posts={posts ? posts?.filter(({ published }) => !!published) : []}
              integrations={integrations!}
              title={`Latest published (${
                posts?.filter(({ published }) => !!published)?.length
              })`}
            />
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

Dashboard.auth = true;
