import Box from '@components/Box';
import Text from '@components/Text';
import usePosts from '@hooks/usePosts';
import fetchJson from '@lib/fetchJson';
import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { EMPTY_IMG } from 'pages/dashboard';
import React from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsArrowUpRight } from 'react-icons/bs';
import styled from 'styled-components';
import ChipButton from '../ChipButton';

interface DraftCardProps {
  draft: Post;
  selectPost: (post: Post) => void;
}

const PostCard = styled(Box)`
  margin: 8px 0;
  padding: 16px;
  display: flex;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default function DraftCard({ draft, selectPost }: DraftCardProps) {
  const { id, cover, title, content, updatedAt } = draft;
  const { refresh } = usePosts();

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

  return (
    <Link
      href={{
        pathname: '/dashboard/post/[id]',
        query: { id },
      }}
      passHref
    >
      <PostCard className={styles.clickableCard}>
        <Box position='relative' width='30vw' height='15vw' flexShrink={0}>
          <Image
            src={cover ?? EMPTY_IMG}
            alt='cover'
            layout='fill'
            objectFit='contain'
          />
        </Box>
        <Box display='flex' flexDirection='column' ml='8px'>
          <Text
            color='primary'
            fontSize='1.2em'
            fontWeight='bold'
            overflow='hidden'
            maxHeight='3.6em'
          >
            {title}
          </Text>
          <Text color='gray' marginY='8px'>
            {`Last edited ${formatDistanceToNow(
              parseISO(updatedAt.toString()),
              {
                addSuffix: true,
              }
            )}`}
          </Text>
          <Box display='flex'>
            <ChipButton
              label='Publish'
              callback={onPublish}
              Icon={BsArrowUpRight}
              color='white'
              background='primary'
            />
            <ChipButton
              label='Delete'
              callback={showConfirm}
              color='red'
              background='unset'
            />
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
      </PostCard>
    </Link>
  );
}
