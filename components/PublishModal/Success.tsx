import Box from '@components/Box';
import ChipButton from '@components/ChipButton';
import PublishedCard from '@components/PostList/PublishedCard';
import Text from '@components/Text';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import React from 'react';
import { BsTwitter } from 'react-icons/bs';

interface SuccessProps {
  post: Post;
  publications: Publication[];
  integrations: (Integration & { provider: Provider })[];
  scheduledAt: Date | null;
}

export default function Success({
  post,
  publications,
  integrations,
  scheduledAt,
}: SuccessProps) {
  const publishedPost: Post & { publications: Publication[] } = {
    ...post,
    publications,
  };

  const shareOnTwitter = () => {
    const canonicalUrl = publications.find((pub) => pub.isCanonical)!.url;
    const param = `I just published a new blog post titled "${post.title}", check it out ⚡️
          
          ${canonicalUrl}
          `;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(param)}`,
      '_blank'
    );
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='100%'
      py='16px'
    >
      <Text fontSize='1.5em' fontWeight='bold'>
        Congrats for your new article 🚀
      </Text>
      <Text my='8px' color='gray.500'>
        Share it with the world
      </Text>
      <ChipButton callback={shareOnTwitter} color='#1DA1F2'>
        <Text mr={1} color='white'>
          Tweet
        </Text>
        <BsTwitter size={16} color='white' />
      </ChipButton>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        height='100%'
      >
        {scheduledAt && (
          <Box
            border='1px solid'
            color='gray.300'
            borderRadius='4px'
            p='8px'
            my={3}
          >
            <Text color='gray.500'>
              ⏱ Your post will be published on{' '}
              {scheduledAt.toLocaleDateString()}
            </Text>
          </Box>
        )}
        <PublishedCard post={publishedPost} integrations={integrations} />
      </Box>
    </Box>
  );
}
