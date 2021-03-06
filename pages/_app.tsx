import Box from '@components/Box';
import ErrorBoundary from '@components/ErrorBoundary';
import { GlobalStyles } from '@components/GlobalStyle';
import Head from '@components/Head';
import Header from '@components/Header';
import Spinner from '@components/Spinner';
import ThemeProvider from 'contexts/ThemeContext';
import { NextComponentType, NextPageContext } from 'next';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React from 'react';
import { Toaster } from 'react-hot-toast';

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & {
  Component: NextComponentType<NextPageContext> & { auth: boolean };
}) {
  return (
    <>
      <Head />
      <ErrorBoundary>
        <SessionProvider session={session}>
          <ThemeProvider>
            <GlobalStyles />
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
    </>
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

export default App;
