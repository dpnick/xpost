import Box from '@components/Box';
import Text from '@components/Text';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Image from 'next/image';
import { EMPTY_IMG } from 'pages/dashboard';
import React from 'react';
import ChipButton from './ChipButton';

interface PublishedCardProps {
  post: Post & { publications: Publication[] };
  integrations: (Integration & { provider: Provider })[];
}

export default function PublishedCard({
  post,
  integrations,
}: PublishedCardProps) {
  const { cover, title, firstPublishedAt, publications } = post;

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box display='flex' p='16px' my='8px' className={styles.card}>
      <Box position='relative' width='30vw' height='15vw' flexShrink={0}>
        <Image src={cover ?? EMPTY_IMG} layout='fill' objectFit='contain' />
      </Box>
      <Box display='flex' flexDirection='column' ml='8px'>
        <Text
          color='primary'
          fontSize='1.2em'
          fontWeight='bold'
          overflow='hidden'
          maxHeight='3.6em'
          style={{
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Text>
        <Text color='gray' marginY='8px'>
          {`First published ${formatDistanceToNow(
            parseISO(firstPublishedAt!.toString()),
            {
              addSuffix: true,
            }
          )}`}
        </Text>
        <Box display='flex' mt='8px'>
          {publications?.map((publication) => {
            const integration = integrations?.find(
              ({ id }) => id === publication.integrationId
            );

            if (integration) {
              return (
                <ChipButton
                  key={publication.id}
                  label={`${integration.provider.displayName} - ${integration.username}`}
                  callback={() => openUrl(publication.url)}
                  color='white'
                  background={integration.provider.color}
                />
              );
            }

            return null;
          })}
        </Box>
      </Box>
    </Box>
  );
}
