import Box from '@components/Box';
import IconButton from '@components/IconButton';
import StyledInput from '@components/StyledInput';
import Text from '@components/Text';
import usePosts from '@hooks/usePosts';
import useTags from '@hooks/useTags';
import useThrottle from '@hooks/useThrottle';
import fetchJson from '@lib/fetchJson';
import { SelectOption } from '@models/selectOption';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdArrowBack } from 'react-icons/io';
import { MultiSelect } from 'react-multi-select-component';
import styled from 'styled-components';
import Divider from './Divider';
import PublishButton from './PublishButton';
import StyledSelect from './StyledSelect';

const StyledMultiSelect = styled(MultiSelect)`
  --rmsc-bg: ${({ theme }) => theme.colors.accent};
  --rmsc-main: ${({ theme }) => theme.colors.primary};
  --rmsc-bg: ${({ theme }) => theme.colors.gray[100]};
  --rmsc-border: ${({ theme }) => theme.colors.gray[300]};
  --rmsc-h: 40px;
  --rmsc-p: 8px;
  margin-top: 8px;
  cursor: pointer;

  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
`;

const Info = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.space[3]}px;
`;

interface CustomizePublicationProps {
  post: Post;
  integrationsSelected: (Integration & { provider: Provider })[];
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  scheduledAt: Date | null;
  next: () => void;
  previous: () => void;
}

export default function CustomizePublication({
  post,
  integrationsSelected,
  setPublications,
  scheduledAt,
  previous,
  next,
}: CustomizePublicationProps) {
  const { tags, isLoading: tagsLoading } = useTags();
  const { refresh } = usePosts();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);
  const [unformattedSlug, setUnformattedSlug] = useState<string>('');
  const [slug, setSlug] = useState<string>(slugify(post.title ?? '-'));

  const slugifySlug = useCallback(() => {
    if (unformattedSlug) {
      setSlug(slugify(unformattedSlug));
    }
  }, [unformattedSlug]);

  useThrottle(slugifySlug, 1500, [unformattedSlug]);

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

  const onPublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post?.content || !post?.title) {
      toast.error('Your article must contain a title and a content');
      return;
    }

    if (post?.title?.length < 20) {
      toast.error('Your article title must be at least 20 characters long');
      return;
    }

    setSubmitted(true);
    const originalIntegrationId = (event.target as HTMLFormElement).origin
      ?.value;
    try {
      // regex to find empty line containing only a backslash
      // check: https://github.com/outline/rich-markdown-editor/issues/532
      const stripRegEx = new RegExp(/^\\\W*$/gm);
      if (stripRegEx.test(post.content)) {
        post.content = post.content.replaceAll(stripRegEx, '');
      }
      post.tags = selectedTags?.map((tag) => tag.label).toString();
      post.slug = slugify(slug);
      const res: { url: string; publications: Publication[] } = await fetchJson(
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
        }
      );
      setPublications(res.publications);
      refresh();
      next();
    } catch {
      setSubmitted(false);
    }
  };

  const onSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post?.content || !post?.title) {
      toast.error('Your article must contain a title and a content');
      return;
    }

    if (post?.title?.length < 20) {
      toast.error('Your article title must be at least 20 characters long');
      return;
    }

    setSubmitted(true);
    const originalIntegrationId = (event.target as HTMLFormElement).origin
      ?.value;
    try {
      await fetchJson(
        '/api/post/schedule',
        {
          method: 'POST',
          body: JSON.stringify({
            postId: post.id,
            scheduledAt,
            tags: selectedTags ?? [],
            slug: slugify(slug),
            integrations: integrationsSelected,
            originalIntegrationId,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true,
        {
          success: 'Your article will be published on the selected date 🔥',
          loading: 'Communicating with your blogging platform(s)',
        }
      );
      refresh();
      next();
    } catch {
      setSubmitted(false);
    }
  };

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

  return (
    <Box width='100%' height='100%' position='relative'>
      <Box display='flex' alignItems='center' mb={3}>
        <IconButton Icon={IoMdArrowBack} color='black' onClick={previous} />
        <Text fontSize='1.4em' fontWeight='bold' ml={2}>
          Customize your publication
        </Text>
      </Box>
      <Divider />
      <form
        onSubmit={!!scheduledAt ? onSchedule : onPublish}
        style={{ width: '100%' }}
      >
        <Text fontSize='1em' fontWeight='bold' mt={2} mb={2}>
          Original platform
        </Text>
        <Info>
          <Text color='gray.500' m={2}>
            💡 Improve your SEO by helping the search engine to reference your
            content.
          </Text>
        </Info>
        <StyledSelect id='origin' aria-label='originally published at' required>
          {integrationsSelected.map(({ id, username, provider }) => (
            <option key={id} value={id}>
              {provider.displayName} - {username}
            </option>
          ))}
        </StyledSelect>
        <Text fontSize='1em' fontWeight='bold' mt={4} mb={2}>
          Tags
        </Text>
        <Info>
          <Text color='gray.500' m={2}>
            💡 Providing tags corresponding to the subject will help people
            interested in these topics to find your content.
          </Text>
        </Info>
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
        <Text fontSize='1em' fontWeight='bold' mt={4} mb={2}>
          Slug
        </Text>
        <Text color='gray.500' mb='8px'>
          A slug is a text identifier for a publication. Some platform allow you
          to customize it for a better readibility and SEO.
        </Text>
        <Info>
          <Text color='gray.500' m={2}>
            💡 Keep it short and representative of your content for better
            performance.
          </Text>
        </Info>
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
          value={
            !!scheduledAt
              ? `Schedule for ${scheduledAt.toLocaleString()}`
              : 'Publish'
          }
          type='submit'
        />
      </form>
    </Box>
  );
}
