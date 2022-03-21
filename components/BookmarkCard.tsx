import { DailyDevItem } from '@models/dailyDevItem';
import styles from '@styles/Dashboard.module.scss';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import Box from './Box';
import Text from './Text';

const Container = styled(Box)`
  margin: 8px 0;
  padding: 16px;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

interface BookmarkCardProps {
  bookmark: DailyDevItem;
}

export const DAILY_DEV_LOGO = '/logo/daily_dev.svg';

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { link, title, pubDate, category } = bookmark;

  const openBookmark = () => {
    window.open(link, '_blank');
  };

  // add at least Daily.dev logo here and add the adding url stage
  return (
    <Container onClick={openBookmark} className={styles.clickableCard}>
      <Box position='relative' width='100%' height='150px' flexShrink={0}>
        <Image
          src={DAILY_DEV_LOGO}
          alt='cover'
          layout='fill'
          objectFit='contain'
        />
      </Box>
      <Text
        fontSize='1.2em'
        fontWeight='bold'
        textAlign='center'
        color='primary'
        mb={3}
      >
        {title}
      </Text>
      <Text color='gray.500' textAlign='center' mb={2}>
        Published {formatDistanceToNow(new Date(pubDate), { addSuffix: true })}
      </Text>
      {category && (
        <Text textAlign='center'>
          {Array.isArray(category)
            ? category
                .map((tag) => `#${tag}`)
                .join(' ')
                .toString()
            : `#${category}`}
        </Text>
      )}
    </Container>
  );
}
