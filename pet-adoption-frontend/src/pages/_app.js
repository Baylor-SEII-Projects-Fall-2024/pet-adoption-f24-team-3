import React from 'react';
import Head from 'next/head';
import App from 'next/app';

import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { useRouter } from "next/router";

import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';

import { PetAdoptionThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';

import HeaderBar from '@/components/HeaderBar';

import '@/styles/globals.css'

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

const safePaths = [
  '/',
  '/login',
  '/register',
  '/register/owner',
  '/register/center',

];

function PetApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={reduxStore}>
      <MainApp Component={Component} pageProps={pageProps} />
    </ReduxProvider>
  );
}

function MainApp({ Component, pageProps }) {

  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const router = useRouter();

  // useEffect(() => {
  //   if (userId === null) {
  //     router.push('/login');
  //   }
  // }, [userId, router]);

  // Client-side redirection check
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      // Check the new URL after a navigation
      console.log('Navigating to:', url);
      if (currentUserId == null && !safePaths.find(u => u === url)) {
        console.log('Redirecting to /login from:', url);
        router.push('/login');
      }
    };

    // Subscribe to route change events
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup the event listener on unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <AppCacheProvider>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PetAdoptionThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <HeaderBar />
        <Component {...pageProps} />
      </PetAdoptionThemeProvider>
    </AppCacheProvider>
  );
}


PetApp.getInitialProps = async (appContext) => {
  // Step 1: Get the initial props for the app component.
  const appProps = await App.getInitialProps(appContext);

  // Step 2: Destructure appContext to access context properties.
  const { ctx } = appContext;
  const { res, pathname } = ctx;

  // Debugging output
  console.log('Current pathname:', pathname);
  console.log("Res:", res);

  // Step 3: Skip redirection for the home page ('/').
  if (safePaths.find(p => p === pathname)) {
    return { ...appProps };
  }

  // Step 4: Redirect to login for all other pages.
  if (res) {
    console.warn("Redirecting to login");
    res.writeHead(302, { Location: '/login' });
    res.end();
  }

  return { ...appProps };
}

export default PetApp;