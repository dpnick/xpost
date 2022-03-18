import Box from '@components/Box';
import ChipButton from '@components/ChipButton';
import StyledInput from '@components/StyledInput';
import usePosts from '@hooks/usePosts';
import useTags from '@hooks/useTags';
import useThrottle from '@hooks/useThrottle';
import fetchJson from '@lib/fetchJson';
import { SelectOption } from '@models/selectOption';
import { Integration, Post, Provider } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { BsTwitter } from 'react-icons/bs';
import { MultiSelect } from 'react-multi-select-component';
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

const StyledMultiSelect = styled(MultiSelect)`
  --rmsc-bg: ${({ theme }) => theme.colors.accent};
  --rmsc-main: ${({ theme }) => theme.colors.primary};
  --rmsc-bg: ${({ theme }) => theme.colors.gray[100]};
  --rmsc-border: ${({ theme }) => theme.colors.gray[300]};
  --rmsc-h: 40px;
  --rmsc-p: 8px;
  margin-top: 8px;
  cursor: pointer;
`;

export default function PublishModal({
  post,
  integrations,
}: PublishModalProps) {
  const { tags, isLoading: tagsLoading } = useTags();
  const { refresh } = usePosts();
  const [successUrl, setSuccessUrl] = useState<string>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [integrationsSelected, setIntegrationsSelected] = useState<
    (Integration & { provider: Provider })[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);

  const [unformattedSlug, setUnformattedSlug] = useState<string>('');
  const [slug, setSlug] = useState<string>(slugify(post.title ?? '-'));

  const slugifySlug = useCallback(() => {
    if (unformattedSlug) {
      setSlug(slugify(unformattedSlug));
    }
  }, [unformattedSlug]);

  useThrottle(slugifySlug, 1500, [unformattedSlug]);

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

  const onPublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post?.content || !post?.title) {
      toast.error('Your article must contain a title and a content');
      return;
    }

    setSubmitted(true);
    const originalIntegrationId = (event.target as HTMLFormElement).origin
      ?.value;
    try {
      post.content = post.content!.replaceAll('\\', '');
      post.tags = selectedTags?.map((tag) => tag.label).toString();
      post.slug = slugify(slug);
      const res: { url: string } = await fetchJson(
        '/api/post/publish',
        {
          method: 'POST',
          body: JSON.stringify({
            post,
            tags: selectedTags ?? [],
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
      setSuccessUrl(res.url);
      refresh();
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

  function slugify(title: string): string {
    return title
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .replace(/_+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
      .slice(0, 100);
  }

  const valueRenderer = (selectedOptions: SelectOption[]) => {
    if (!selectedOptions.length) {
      return <span>Select tags (optional)</span>;
    }

    return selectedOptions.map(({ label }) => (
      <Box
        key={label}
        display='inline-block'
        padding='6px'
        color='primary'
        borderRadius='16px'
        borderColor='primary'
        borderStyle='solid'
        borderWidth='1px'
        mr='2px'
      >
        {label}
      </Box>
    ));
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
        py='16px'
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
      pt='16px'
    >
      <form onSubmit={onPublish} style={{ width: '100%' }}>
        {integrations?.length > 0 ? (
          <div>
            <Text fontSize='1.2em' fontWeight='bold' mb='16px'>
              Where you want to publish?
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
                <Text fontSize='1.2em' fontWeight='bold' mt={4} mb={2}>
                  Original platform
                </Text>
                <Box
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='gray.200'
                  mb={3}
                  borderRadius='8px'
                >
                  <Text color='gray.500' m={2}>
                    💡 Improve your SEO by helping the search engine to
                    reference your content.
                  </Text>
                </Box>
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
                <Text fontSize='1.2em' fontWeight='bold' mt={4} mb={2}>
                  Tags
                </Text>
                <Box
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='gray.200'
                  mb={3}
                  borderRadius='8px'
                >
                  <Text color='gray.500' m={2}>
                    💡 Providing tags corresponding to the subject will help
                    people interested in these topics to find your content.
                  </Text>
                </Box>
                <StyledMultiSelect
                  isLoading={tagsLoading}
                  options={
                    tags
                      ? tags.map((tag) => ({
                          label: tag.name,
                          value: tag._id,
                        }))
                      : []
                  }
                  value={selectedTags}
                  onChange={(selectedOptions: SelectOption[]) => {
                    setSelectedTags(selectedOptions);
                  }}
                  labelledBy='Select tags for your article'
                  valueRenderer={valueRenderer}
                  isCreatable
                />
                <Text fontSize='1.2em' fontWeight='bold' mt={4} mb={2}>
                  Slug
                </Text>
                <Text color='gray.500' mb='8px'>
                  A slug is a text identifier for a publication. Some platform
                  allow you to customize it for a better readibility and SEO.
                </Text>
                <Box
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='gray.200'
                  mb={3}
                  borderRadius='8px'
                >
                  <Text color='gray.500' m={2}>
                    💡 Keep it short and representative of your content for
                    better performance.
                  </Text>
                </Box>
                <StyledInput
                  type='text'
                  value={slug}
                  onChange={(input) => {
                    const value = input.target.value;
                    setSlug(value);
                    setUnformattedSlug(value);
                  }}
                  placeholder='Enter your best slug (will be formatted)'
                  maxLength={100}
                  required
                />
                <PublishButton
                  disabled={integrationsSelected?.length < 1 || submitted}
                  value='Publish'
                  type='submit'
                />
              </>
            )}
          </div>
        ) : (
          <Text color='gray'>
            Connect your first blogging platform to be able to publish!
          </Text>
        )}
      </form>
    </Box>
  );
}
