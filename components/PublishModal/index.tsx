import Box from '@components/Box';
import ChipButton from '@components/PostList/ChipButton';
import fetchJson from '@lib/fetchJson';
import { Integration, Post, Provider } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsTwitter } from 'react-icons/bs';
import styled from 'styled-components';
import Text from '../Text';
import CheckCard from './CheckCard';
import PublishButton from './PublishButton';
import StyledSelect from './StyledSelect';

interface PublishModalProps {
  post: Post;
  integrations: (Integration & { provider: Provider })[];
}

const ModalIntegrationList = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 16px;
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: auto auto auto;
  }
`;

export default function PublishModal({
  post,
  integrations,
}: PublishModalProps) {
  const router = useRouter();
  const [successUrl, setSuccessUrl] = useState<string>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [integrationsSelected, setIntegrationsSelected] = useState<
    (Integration & { provider: Provider })[]
  >([]);

  const updateIntegrations = (
    integration: Integration & { provider: Provider }
  ) => {
    let nextIntegrations = [...integrationsSelected, integration];
    const toRemove = integrationsSelected.find(
      (selected) => selected.id === integration.id
    );
    if (toRemove) {
      nextIntegrations = integrationsSelected.filter(
        (int) => int.id !== integration.id
      );
    }
    setIntegrationsSelected(nextIntegrations);
  };

  const onPublish = async (event: any) => {
    event.preventDefault();

    setSubmitted(true);
    const originalIntegrationId = event.target.origin.value;
    try {
      const res: { url: string } = await fetchJson(
        '/api/post/publish',
        {
          method: 'POST',
          body: JSON.stringify({
            post,
            integrations: integrationsSelected,
            originalIntegrationId,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true,
        {
          success: 'Your article is now available 🔥',
          loading: 'Communicating with your blogging platform(s)',
          error: 'Please make sure your token is valid',
        }
      );
      router.replace(router.asPath);
      setSuccessUrl(res.url);
    } catch {
      setSubmitted(false);
    }
  };

  const shareOnTwitter = (param: string) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(param)}`,
      '_blank'
    );
  };

  if (successUrl) {
    const param = `I just published a new blog post titled "${
      post.title
    }", check it out ⚡️
    
    ${successUrl ?? 'https://code-with-yannick.com'}
    `;
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Text fontSize='1.2em' fontWeight='bold'>
          Congrats for your new article 🚀
        </Text>
        <Text my='8px'>Share it with the world</Text>
        <ChipButton
          label='Tweet'
          callback={() => shareOnTwitter(param)}
          Icon={BsTwitter}
          color='white'
          background='#1DA1F2'
        />
      </Box>
    );
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      height='100%'
      p={0}
    >
      <form onSubmit={onPublish} style={{ width: '100%' }}>
        {integrations?.length > 0 ? (
          <div>
            <Text fontSize='1.2em' fontWeight='bold' mb='16px'>
              Select where you want to publish
            </Text>
            <ModalIntegrationList>
              {integrations.map((integration) => (
                <CheckCard
                  key={integration.id}
                  integration={integration}
                  onToggle={updateIntegrations}
                />
              ))}
            </ModalIntegrationList>
            {integrationsSelected?.length > 0 && (
              <>
                <Text fontSize='1.2em' fontWeight='bold' mt='16px' mb='8px'>
                  Select an origin for your article
                </Text>
                <Text color='gray' mb='16px'>
                  This will improve your SEO
                </Text>
                <StyledSelect
                  id='origin'
                  aria-label='originally published at'
                  required
                >
                  {integrationsSelected.map(({ id, username, provider }) => (
                    <option key={id} value={id}>
                      {provider.displayName} - {username}
                    </option>
                  ))}
                </StyledSelect>
              </>
            )}
          </div>
        ) : (
          <Text color='gray'>
            Connect your first blogging platform to be able to publish!
          </Text>
        )}
        <PublishButton
          disabled={integrationsSelected?.length < 1 || submitted}
          value='Publish'
          type='submit'
        />
      </form>
    </Box>
  );
}
