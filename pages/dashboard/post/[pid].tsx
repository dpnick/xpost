import Box from '@components/Box';
import ChipButton from '@components/ChipButton';
import IconButton from '@components/IconButton';
import Modal from '@components/Modal';
import PublishModal from '@components/PublishModal';
import Spinner from '@components/Spinner';
import Text from '@components/Text';
import Tooltip from '@components/Tooltip';
import YoutubeEmbed from '@components/YoutubeEmbed';
import usePosts from '@hooks/usePosts';
import useProviders from '@hooks/useProviders';
import useThrottle from '@hooks/useThrottle';
import fetchJson from '@lib/fetchJson';
import { CloudinaryImg } from '@models/cloudinaryImg';
import { Post } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsArrowUpRight, BsFillCloudCheckFill } from 'react-icons/bs';
import {
  IoArrowBackCircleSharp,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import Editor, { theme } from 'rich-markdown-editor';
import styled, { useTheme } from 'styled-components';
import { EMPTY_IMG } from '..';

const StyledInput = styled.textarea`
  width: 100%;
  margin-top: 16px;
  min-height: 60px;
  padding: 16px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 4px;
  font-size: 1.5rem;
  font-weight: bold;
  resize: none;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
`;

export default function Edit() {
  const router = useRouter();
  const { pid } = router.query;
  const { colors } = useTheme();
  const [toUpdate, setToUpdate] = useState<Partial<Post>>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cover, setCover] = useState<string>();

  const coverRef = useRef<HTMLInputElement>(null);

  const { selectedPost, refresh } = usePosts(pid as string);
  const { integrations } = useProviders();

  const updatePostCache = useCallback(
    (toUpdate: Partial<Post>) => {
      // local update without revalidate
      refresh((prev) => {
        const selected = prev?.find((post) => post.id === pid);
        let next: Post[] | undefined = undefined;
        if (prev && selected) {
          next = [
            ...prev.filter((post) => post.id !== pid),
            { ...selected, ...toUpdate },
          ];
        }
        return next;
      }, false);
    },
    [refresh, pid]
  );

  const fetchUpdates = useCallback(async () => {
    if (pid && toUpdate) {
      try {
        setIsSaving(true);
        await fetchJson('/api/post/update', {
          method: 'POST',
          body: JSON.stringify({ update: toUpdate, pid }),
          headers: { 'Content-type': 'application/json' },
        });
        setIsSaving(false);
        updatePostCache(toUpdate);
      } catch {
        toast.error('Something went wrong updating your draft');
      }
    }
  }, [toUpdate, pid, updatePostCache]);

  useThrottle(fetchUpdates, 1500, [toUpdate, pid, updatePostCache]);

  const uploadImg = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'fqrn8m2d');

    let url = EMPTY_IMG;
    try {
      const result: CloudinaryImg = await fetchJson(
        'https://api.cloudinary.com/v1_1/dpnick/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      url = result.url;
    } catch {
      toast.error(
        'An error occured uploading your image: supported formats are jpg, png and jpeg and max size is 10Mb'
      );
    }

    return url;
  };

  const updatePost = async (value: string, key: keyof Post) => {
    setToUpdate({ [key]: value });
  };

  const udpateContent = (result: () => string) => {
    const value = result();
    updatePost(value, 'content');
  };
  const udpateTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    updatePost(event.target.value, 'title');

  const handleCoverInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files?.length > 0) {
      try {
        const url = await uploadImg(files[0]);
        await fetchJson(
          '/api/post/add-cover',
          {
            method: 'POST',
            body: JSON.stringify({ pid, cover: url }),
            headers: { 'Content-type': 'application/json' },
          },
          true
        );
        setCover(url);
      } catch {
        toast.error('Something went wrong uploading your cover');
      }
    }
  };

  const triggerClickCover = () => {
    coverRef?.current?.click();
  };

  const goBack = () => router.back();

  const onDelete = async (toastId: string) => {
    try {
      toast.dismiss(toastId);
      await fetchJson(
        '/api/post/delete',
        {
          method: 'POST',
          body: JSON.stringify({
            postId: selectedPost?.id,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true
      );
      router.back();
    } catch {
      toast.error('Please retry later');
    }
  };

  const showConfirm = () => {
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

  if (!selectedPost || !integrations) {
    return (
      <Box
        width='100%'
        height='100vh'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box paddingY={4} width={['90%', '70%', '60%']} margin='auto'>
      <Box
        width='100%'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <IconButton
          Icon={IoArrowBackCircleSharp}
          color='black'
          onClick={goBack}
          size='2em'
        />
        <Box display='flex' alignItems='center'>
          {!selectedPost?.published && (
            <Modal
              content={
                <PublishModal
                  post={selectedPost!}
                  integrations={integrations!}
                />
              }
            >
              <Box>
                <ChipButton color='primary'>
                  <Text mr={1} color='white'>
                    Publish
                  </Text>
                  <BsArrowUpRight size={16} color='white' />
                </ChipButton>
              </Box>
            </Modal>
          )}
          <IconButton
            Icon={MdDelete}
            color='black'
            hoverColor={colors.danger}
            onClick={showConfirm}
          />
          <Tooltip
            content={
              isSaving
                ? 'Currently saving your content...'
                : 'Content already saved ???'
            }
          >
            <Box display='flex' position='relative'>
              {isSaving ? (
                <Spinner width={20} height={20} icon={false} />
              ) : (
                <BsFillCloudCheckFill size={24} />
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Box display='flex' alignItems='center' justifyContent='center'>
        {selectedPost?.published && (
          <>
            <IoInformationCircleOutline color='gold' size={24} />
            <Text>At the moment published article are readonly.</Text>
          </>
        )}
      </Box>
      <Box
        width='100%'
        height='40vh'
        onClick={triggerClickCover}
        overflow='hidden'
        position='relative'
        className='pointer'
      >
        <Image
          src={cover ?? selectedPost?.cover ?? '/images/add_cover.png'}
          alt='cover'
          layout='fill'
          objectFit='contain'
          priority
        />
      </Box>
      <input ref={coverRef} hidden type='file' onChange={handleCoverInput} />
      <StyledInput
        rows={3}
        defaultValue={selectedPost?.title ?? undefined}
        placeholder='Enter a title here'
        onChange={udpateTitle}
        disabled={selectedPost?.published}
      />
      <Editor
        autoFocus
        readOnly={selectedPost?.published}
        defaultValue={selectedPost?.content ?? undefined}
        onChange={udpateContent}
        uploadImage={uploadImg}
        placeholder='Type / to use blocks'
        disableExtensions={['container_notice']}
        theme={{
          ...theme,
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            text-rendering: optimizeLegibility`,
          link: colors.primary,
          selected: colors.primary,
        }}
        embeds={[
          {
            title: 'Youtube',
            matcher: (href) => href.includes('youtube'),
            component: YoutubeEmbed,
          },
        ]}
      />
    </Box>
  );
}

Edit.auth = true;
