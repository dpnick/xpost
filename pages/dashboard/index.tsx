import Box from '@components/Box';
import Card from '@components/Card';
import Collapse from '@components/Collapse';
import PostList from '@components/PostList';
import ProviderList from '@components/ProviderList';
import fetchJson from '@lib/fetchJson';
import { Integration, Post, Provider } from '@prisma/client';
import { getSession, signIn } from 'next-auth/react';
import router from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoAddSharp } from 'react-icons/io5';

export const EMPTY_IMG =
  'https://res.cloudinary.com/dpnick/image/upload/v1644950666/odvwvkzevytlfy1gqcjk.jpg';

interface DashboardProps {
  drafts: Post[];
  published: Post[];
  providers: Provider[];
  integrations: Integration[];
  isNotAuthenticated: boolean;
}

export default function Dashboard({
  drafts,
  published,
  providers,
  integrations,
  isNotAuthenticated,
}: DashboardProps) {
  useEffect(() => {
    if (isNotAuthenticated) {
      signIn();
    }
  }, [isNotAuthenticated]);

  const createNewDraft = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const newPost: Post = await fetchJson(
      '/api/post/create',
      {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
      },
      true
    );

    if (newPost?.id) {
      router.push({
        pathname: `dashboard/post/${newPost.id}`,
        query: { isPublished: false },
      });
    }
  };

  return (
    <Box width='100%' height='100vh' bg='white' padding='8px 3vw'>
      <div>
        <h3>Providers</h3>
      </div>
      <ProviderList providers={providers} integrations={integrations} />
      <Card
        style={{
          padding: 0,
          marginTop: '16px',
          color: 'accent',
          background: 'accent',
        }}
      >
        <Collapse
          title={`Drafts (${drafts?.length})`}
          headerAction={
            <Box
              display='flex'
              backgroundColor='primary'
              color='white'
              justifyContent='space-between'
              alignItems='center'
              border='1px solid primary'
              borderRadius='8px'
              padding='8px 16px'
              marginRight='16px'
              onClick={createNewDraft}
              style={{ cursor: 'pointer' }}
            >
              New&nbsp;
              <IoAddSharp size={24} />
            </Box>
          }
        >
          <PostList posts={drafts} />
        </Collapse>
      </Card>
      <Card
        style={{
          padding: 0,
          marginTop: '16px',
          color: 'accent',
          background: 'accent',
        }}
      >
        <Collapse title={`Latest published (${published?.length})`}>
          <PostList posts={published} />
        </Collapse>
      </Card>
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { props: { isNotAuthenticated: true } };
  }

  let posts = { drafts: [], published: [] };
  let providers = { providers: [], integrations: [] };

  try {
    posts = await fetchJson(
      `${process.env.NEXTAUTH_URL}/api/post/get-by-user`,
      {
        method: 'POST',
        body: JSON.stringify({ session }),
        headers: { 'Content-type': 'application/json' },
      }
    );
    providers = await fetchJson(
      `${process.env.NEXTAUTH_URL}/api/provider/get-providers`,
      {
        method: 'POST',
        body: JSON.stringify({ session }),
        headers: { 'Content-type': 'application/json' },
      }
    );
  } catch {
    toast.error('Error occured while getting your existing posts');
  }

  return { props: { ...posts, ...providers } };
}

Dashboard.auth = true;
