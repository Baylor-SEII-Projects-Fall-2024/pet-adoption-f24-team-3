import React from 'react';
import Head from 'next/head';

import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';
import { PetAdoptionThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';


import '@/styles/globals.css'

import HeaderBar from '@/components/HeaderBar';
import Footer from '@/components/Footer';
import userService from '@/utils/services/userService';
import ChatContainer from '@/components/chat/ChatContainer';
import { ChatProvider } from '@/utils/contexts/chatContext';

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

const safePaths = [
  '/',
  '/login',
  '/register',
  '/register/owner',
  '/register/center',
  '/about',
];


function PetApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={reduxStore}>
      <ChatProvider>
        <MainApp Component={Component} pageProps={pageProps} />
      </ChatProvider>
    </ReduxProvider>
  );
}

function MainApp({ Component, pageProps }) {

  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const router = useRouter();

  const { authenticateFromCookie } = userService();

  React.useEffect(() => {
    async function checkCookies() {
      await authenticateFromCookie()
        .then((result) => {
          if (result == false) {
            const url = window.location.pathname;
            redirectRestrictedPaths(url);
          }
        });
    }
    checkCookies();
  }, []);


  // Client-side redirection check
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      // Check the new URL after a navigation
      if (currentUserId == null) {
        redirectRestrictedPaths(url);
      }
    };

    // Subscribe to route change events
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup the event listener on unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, currentUserId]);


  const redirectRestrictedPaths = (url) => {
    if (!safePaths.find(u => u === url)) {
      router.push('/login');
    }
  }

  return (
    <AppCacheProvider>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <link rel='icon' href='/favicon.svg' />
      </Head>

      <PetAdoptionThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <HeaderBar />
        <div style={{ minHeight: "90vh" }}>
          <Component {...pageProps} />
        </div>
        <Footer />
        {currentUserId && <ChatContainer />}
      </PetAdoptionThemeProvider>

    </AppCacheProvider >
  );
}

export default PetApp;