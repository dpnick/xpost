import Box from '@components/Box';
import ErrorBoundary from '@components/ErrorBoundary';
import Header from '@components/Header';
import Spinner from '@components/Spinner';
import '@styles/globals.scss';
import ThemeProvider from 'contexts/ThemeContext';
import { NextComponentType, NextPageContext } from 'next';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & {
  Component: NextComponentType<NextPageContext> & { auth: boolean };
}) {
  return (
    <ErrorBoundary>
      <FaviconHead />
      <SessionProvider session={session}>
        <ThemeProvider>
          {Component.auth ? (
            <Auth>
              <>
                <Header />
                <Component {...pageProps} />
              </>
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  );
}

function Auth({ children }: { children: JSX.Element }) {
  const { data: session } = useSession({ required: true });
  const isUser = !!session?.user;

  if (isUser) {
    return children;
  }

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Spinner />
    </Box>
  );
}

function FaviconHead() {
  return (
    <Head>
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      <link rel='shortcut icon' href='/images/favicon.ico' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/images/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/images/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/images/favicon-16x16.png'
      />
    </Head>
  );
}

export default App;
