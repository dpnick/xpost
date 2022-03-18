import Box from '@components/Box';
import Text from '@components/Text';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EMPTY_IMG } from 'pages/dashboard';
import React from 'react';
import ChipButton from '../ChipButton';
import PostCardContainer from './PostCardContainer';

interface PublishedCardProps {
  post: Post & { publications: Publication[] };
  integrations: (Integration & { provider: Provider })[];
}

export default function PublishedCard({
  post,
  integrations,
}: PublishedCardProps) {
  const { id, cover, title, firstPublishedAt, publications, tags } = post;
  const router = useRouter();

  const arrTags = tags && tags?.split(',');

  const openUrl = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    url: string
  ) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  const goPublished = () => {
    router.push({
      pathname: '/dashboard/post/[pid]',
      query: { pid: id },
    });
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
        {firstPublishedAt && (
          <Text color='gray.500' marginY='8px' textAlign={['center', 'unset']}>
            {`First published ${formatDistanceToNow(
              parseISO(firstPublishedAt.toString()),
              {
                addSuffix: true,
              }
            )}`}
          </Text>
        )}
        <Box
          display='flex'
          flexWrap='wrap'
          mt='8px'
          justifyContent={['center', 'unset']}
        >
          {publications?.map((publication) => {
            const integration = integrations?.find(
              ({ id }) => id === publication.integrationId
            );

            if (integration) {
              const { provider } = integration;
              return (
                <ChipButton
                  key={publication.id}
                  callback={(event) => openUrl(event, publication.url)}
                  color={provider.color}
                  outline
                >
                  <Image
                    src={provider.logoUrl}
                    alt={`${provider.name} logo`}
                    width={20}
                    height={20}
                  />
                  <Text ml={2} color={provider.color}>
                    {integration.username}
                  </Text>
                </ChipButton>
              );
            }

            return null;
          })}
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
      </Box>
    </PostCardContainer>
  );
}
