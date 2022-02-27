import Box from '@components/Box';
import Spinner from '@components/Spinner';
import Text from '@components/Text';
import YoutubeEmbed from '@components/YoutubeEmbed';
import fetchJson from '@lib/fetchJson';
import { CloudinaryImg } from '@models/cloudinaryImg';
import { Post } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsFillCloudCheckFill } from 'react-icons/bs';
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
  const { pid, isPublished } = router.query;

  const [post, setPost] = useState<Post | undefined>();
  const [toUpdate, setToUpdate] = useState<Partial<Post>>();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(!!pid);

  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getPost = async () => {
      if (pid) {
        try {
          const nextPost: Post = await fetchJson('/api/post/get-post', {
            method: 'POST',
            body: JSON.stringify({ pid }),
            headers: { 'Content-type': 'application/json' },
          });
          setPost(nextPost);
          setIsLoading(false);
        } catch {
          toast.error('Error while fetching your post');
          setIsLoading(false);
        }
      }
    };

    getPost();
  }, [pid]);

  useEffect(() => {
    let handler: NodeJS.Timeout;
    if (post) {
      handler = setTimeout(async () => {
        try {
          setIsSaving(true);
          const updatedPost: Post = await fetchJson('/api/post/update', {
            method: 'POST',
            body: JSON.stringify({ update: toUpdate, pid: post.id }),
            headers: { 'Content-type': 'application/json' },
          });
          setPost(updatedPost);
          setIsSaving(false);
        } catch {
          toast.error('Something went wrong updating your draft');
        }
      }, 1000);
    }
    return () => {
      clearTimeout(handler);
    };
  }, [toUpdate]);

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

  if (isLoading) {
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

  const handleCoverInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handle validations
    const files = event.target.files;
    if (files && files?.length > 0) {
      try {
        const url = await uploadImg(files[0]);
        // save it to db
        await fetchJson(
          '/api/post/add-cover',
          {
            method: 'POST',
            body: JSON.stringify({ pid, cover: url }),
            headers: { 'Content-type': 'application/json' },
          },
          true
        );
        setPost((prev) => {
          if (prev) {
            return { ...prev, cover: url };
          }
        });
      } catch {
        toast.error('Something went wrong uploading your cover');
      }
    }
  };

  const triggerClickCover = () => {
    coverRef?.current?.click();
  };

  const goBack = () => router.back();

  return (
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
            <BsFillCloudCheckFill size='1.5em' />
          )}
        </Box>
      </Box>
      {isPublished && (
        <Box display='flex' alignItems='center' justifyContent='center'>
          <IoInformationCircleOutline color='gold' size={24} />
          <Text>At the moment published article are readonly.</Text>
        </Box>
      )}
      <Box
        width='100%'
        height='40vh'
        onClick={triggerClickCover}
        style={{ cursor: 'pointer' }}
        overflow='hidden'
        position='relative'
      >
        <Image
          src={post?.cover ?? EMPTY_IMG}
          layout='fill'
          objectFit='contain'
        />
        {!post?.cover && (
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
        defaultValue={post?.title ?? undefined}
        placeholder='Enter a title here'
        onChange={udpateTitle}
      />
      <Editor
        autoFocus
        readOnly={!!isPublished}
        defaultValue={post?.content ?? undefined}
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
  );
}

Edit.auth = true;
