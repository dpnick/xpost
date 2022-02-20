import Box from '@components/Box';
import Spinner from '@components/Spinner';
import YoutubeEmbed from '@components/YoutubeEmbed';
import fetchJson from '@lib/fetchJson';
import { CloudinaryImg } from '@models/cloudinaryImg';
import { Post } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Editor from 'rich-markdown-editor';
import styled from 'styled-components';
import { EMPTY_IMG } from '..';

const StyledInput = styled.input`
  width: 100%;
  margin-top: 16px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
`;

export default function Edit() {
  const router = useRouter();
  const { pid, isPublished } = router.query;

  const [post, setPost] = useState<Post | undefined>();
  const [toUpdate, setToUpdate] = useState<Partial<Post>>();

  const [isLoading, setIsLoading] = useState<boolean>(!!pid);

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
        }
      }
    };

    getPost();
  }, [pid]);

  useEffect(() => {
    // send request to update value on db
    let handler: NodeJS.Timeout;
    if (post) {
      handler = setTimeout(async () => {
        console.log('CALLED');
        const updatedPost: Post = await fetchJson('/api/post/update', {
          method: 'POST',
          body: JSON.stringify({ update: toUpdate, pid: post.id }),
          headers: { 'Content-type': 'application/json' },
        });
        setPost(updatedPost);
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
    } catch (err) {
      alert(
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
  const udpateTitle = (event: React.ChangeEvent<HTMLInputElement>) =>
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

  return (
    <Box paddingX='32px'>
      <StyledInput
        defaultValue={post?.title ?? undefined}
        placeholder='Enter a title here'
        onChange={udpateTitle}
      />
      <Editor
        autoFocus
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
