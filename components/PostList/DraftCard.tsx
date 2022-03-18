import Box from '@components/Box';
import Text from '@components/Text';
import usePosts from '@hooks/usePosts';
import fetchJson from '@lib/fetchJson';
import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EMPTY_IMG } from 'pages/dashboard';
import React from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsArrowUpRight } from 'react-icons/bs';
import ChipButton from '../ChipButton';
import PostCardContainer from './PostCardContainer';

interface DraftCardProps {
  draft: Post;
  selectPost: (post: Post) => void;
}

export default function DraftCard({ draft, selectPost }: DraftCardProps) {
  const { id, cover, title, content, updatedAt } = draft;
  const { refresh } = usePosts();
  const router = useRouter();

  const onPublish = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    window.scrollTo(0, 0);
    selectPost(draft);
  };

  const onDelete = async (toastId: string) => {
    try {
      toast.dismiss(toastId);
      await fetchJson(
        '/api/post/delete',
        {
          method: 'POST',
          body: JSON.stringify({
            postId: id,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true
      );
      refresh();
    } catch {
      toast.error('Please retry later');
    }
  };

  const showConfirm = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    toast(
      (ref) => (
        <Box>
          <span>
            Confirm to delete &nbsp;
            <button onClick={() => onDelete(ref.id)}>OK</button>
          </span>
        </Box>
      ),
      {
        icon: <AiFillQuestionCircle color='orange' />,
      }
    );
  };

  const goDraft = () => {
    router.push({
      pathname: '/dashboard/post/[pid]',
      query: { pid: id },
    });
  };

  return (
    <PostCardContainer
      flexDirection={['column', 'row']}
      alignItems={['center', 'unset']}
      onClick={goDraft}
      className={styles.clickableCard}
    >
      <Box
        position='relative'
        width={['100%', '30vw']}
        height={['150px', '15vw']}
        flexShrink={0}
      >
        <Image
          src={cover ?? EMPTY_IMG}
          alt='cover'
          layout='fill'
          objectFit='contain'
        />
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        mt={['16px', 0]}
        ml={[0, '8px']}
      >
        <Text
          color='primary'
          fontSize='1.2em'
          fontWeight='bold'
          overflow='hidden'
          maxHeight='3.6em'
          textAlign={['center', 'unset']}
        >
          {title}
        </Text>
        <Text color='gray.500' marginY='8px' textAlign={['center', 'unset']}>
          {`Last edited ${formatDistanceToNow(parseISO(updatedAt.toString()), {
            addSuffix: true,
          })}`}
        </Text>
        <Box display='flex' justifyContent={['center', 'unset']}>
          <ChipButton callback={onPublish} color='primary'>
            <Text mr={1} color='white'>
              Publish
            </Text>
            <BsArrowUpRight size={16} color='white' />
          </ChipButton>
          <ChipButton callback={showConfirm} color='danger' outline>
            <Text color='danger'>Delete</Text>
          </ChipButton>
        </Box>
        <Text
          overflow='hidden'
          lineHeight='1.2em'
          maxHeight='6em'
          display={['none', 'unset']}
          mt='8px'
        >
          {content}
        </Text>
      </Box>
    </PostCardContainer>
  );
}
