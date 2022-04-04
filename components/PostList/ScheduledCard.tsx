import Box from '@components/Box';
import Text from '@components/Text';
import usePosts from '@hooks/usePosts';
import fetchJson from '@lib/fetchJson';
import { parseMarkdownToText } from '@lib/parser/markdown';
import { Post, Publication } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { parseISO } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EMPTY_IMG } from 'pages/dashboard';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import ChipButton from '../ChipButton';
import PostCardContainer from './PostCardContainer';
import Preview from './Preview';

interface ScheduledCardProps {
  post: Post & { publications: Publication[] };
}

export default function ScheduledCard({ post }: ScheduledCardProps) {
  const { id, cover, title, content, scheduledAt, tags } = post;
  const [preview, setPreview] = useState<string>();
  const { refresh } = usePosts();
  const router = useRouter();

  const arrTags = tags && tags?.split(',');

  useEffect(() => {
    if (content && content?.length > 0) {
      const stripRegEx = new RegExp(/^\\\W*$/gm);
      const fiveFirstLines = content
        .split('\n')
        ?.filter((value) => !stripRegEx.test(value) && value)
        ?.filter((_, index) => index <= 4)
        ?.join('\n');
      const result = parseMarkdownToText(fiveFirstLines);
      setPreview(result);
    }
  }, [content]);

  const goPublished = () => {
    router.push({
      pathname: '/dashboard/post/[pid]',
      query: { pid: id },
    });
  };

  const onUnschedule = async (toastId: string) => {
    try {
      toast.dismiss(toastId);
      await fetchJson(
        '/api/post/unschedule',
        {
          method: 'POST',
          body: JSON.stringify({
            postId: id,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true,
        {
          loading: 'Unscheduling your article',
          success: 'Your article is back in draft',
        }
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
            Confirm to unschedule this post &nbsp;
            <button onClick={() => onUnschedule(ref.id)}>OK</button>
          </span>
        </Box>
      ),
      {
        icon: <AiFillQuestionCircle color='orange' />,
      }
    );
  };

  return (
    <PostCardContainer
      flexDirection={['column', 'row']}
      alignItems={['center', 'unset']}
      onClick={goPublished}
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
        {scheduledAt && (
          <Text color='gray.500' marginY='8px' textAlign={['center', 'unset']}>
            {`⏱ Planned for ${parseISO(
              scheduledAt.toString()
            ).toLocaleDateString(undefined, {
              dateStyle: 'short',
            })} at ${parseISO(scheduledAt.toString()).toLocaleTimeString(
              undefined,
              { hour: '2-digit', minute: '2-digit' }
            )}`}
          </Text>
        )}
        <Box
          display='flex'
          flexWrap='wrap'
          mt='8px'
          justifyContent={['center', 'unset']}
        >
          <ChipButton callback={showConfirm} color='danger' outline>
            <Text color='danger'>Unschedule</Text>
          </ChipButton>
        </Box>
        {arrTags && (
          <Box
            display='flex'
            flexWrap='wrap'
            mt='8px'
            justifyContent={['center', 'unset']}
          >
            {arrTags.map((tag) => (
              <Text key={tag} mr='4px'>
                #{tag}
              </Text>
            ))}
          </Box>
        )}
        {preview && (
          <Preview display={['none', '-webkit-box']} color='gray.500'>
            {preview}
          </Preview>
        )}
      </Box>
    </PostCardContainer>
  );
}
