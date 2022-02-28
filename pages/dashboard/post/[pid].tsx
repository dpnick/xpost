import Box from '@components/Box';
import ChipButton from '@components/ChipButton';
import Modal from '@components/Modal';
import PublishModal from '@components/PublishModal';
import Spinner from '@components/Spinner';
import Text from '@components/Text';
import YoutubeEmbed from '@components/YoutubeEmbed';
import usePosts from '@hooks/usePosts';
import useProviders from '@hooks/useProviders';
import fetchJson from '@lib/fetchJson';
import { CloudinaryImg } from '@models/cloudinaryImg';
import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsArrowUpRight, BsFillCloudCheckFill } from 'react-icons/bs';
import {
  IoArrowBackCircleSharp,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import Editor from 'rich-markdown-editor';
import styled from 'styled-components';
import { EMPTY_IMG } from '..';

const StyledInput = styled.textarea`
  width: 100%;
  margin-top: 16px;
  min-height: 60px;
  padding: 16px;
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  resize: none;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }
`;

export default function Edit() {
  const router = useRouter();
  const { pid } = router.query;
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [toUpdate, setToUpdate] = useState<Partial<Post>>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cover, setCover] = useState<string>();

  const coverRef = useRef<HTMLInputElement>(null);

  const { selectedPost } = usePosts(pid as string);
  const { integrations } = useProviders();

  useEffect(() => {
    let handler: NodeJS.Timeout;
    if (pid && toUpdate) {
      handler = setTimeout(async () => {
        try {
          setIsSaving(true);
          await fetchJson('/api/post/update', {
            method: 'POST',
            body: JSON.stringify({ update: toUpdate, pid }),
            headers: { 'Content-type': 'application/json' },
          });
          setIsSaving(false);
        } catch {
          toast.error('Something went wrong updating your draft');
        }
      }, 1000);
    }
    return () => {
      clearTimeout(handler);
    };
  }, [toUpdate, pid]);

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

  const hidePublishModal = () => setShowPublishModal(false);

  const onPublish = () => setShowPublishModal(true);

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
    <>
      {showPublishModal && (
        <Modal onClose={hidePublishModal}>
          <PublishModal post={selectedPost!} integrations={integrations!} />
        </Modal>
      )}
      <Box padding={['32px 6vw', '32px 12vw']}>
        <Box
          width='100%'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <IoArrowBackCircleSharp
            onClick={goBack}
            className={styles.pointer}
            size='2em'
          />
          <Box position='relative'>
            {isSaving ? (
              <Spinner width={20} height={20} icon={false} />
            ) : (
              <BsFillCloudCheckFill size='2em' />
            )}
          </Box>
        </Box>

        <Box display='flex' alignItems='center' justifyContent='center'>
          {selectedPost?.published ? (
            <>
              <IoInformationCircleOutline color='gold' size={24} />
              <Text>At the moment published article are readonly.</Text>
            </>
          ) : (
            <>
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
            </>
          )}
        </Box>
        <Box
          width='100%'
          height='40vh'
          onClick={triggerClickCover}
          style={{ cursor: 'pointer' }}
          overflow='hidden'
          position='relative'
        >
          <Image
            src={cover ?? selectedPost?.cover ?? EMPTY_IMG}
            alt='cover'
            layout='fill'
            objectFit='contain'
            priority={true}
          />
          {!cover && !selectedPost?.cover && (
            <Text
              fontSize='1.2em'
              fontWeight='bold'
              textAlign='center'
              className={styles.absoluteCenter}
            >
              Click to add a cover
            </Text>
          )}
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
          embeds={[
            {
              title: 'Youtube',
              matcher: (href) => href.includes('youtube'),
              component: YoutubeEmbed,
            },
          ]}
        />
      </Box>
    </>
  );
}

Edit.auth = true;
