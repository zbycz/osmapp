import React from 'react';
import App, { AppProps } from 'next/app';
import Head from 'next/head';
import nextCookies from 'next-cookies';
import { CssBaseline } from '@mui/material';
import {
  AppCacheProvider,
  EmotionCacheProviderProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import { UserThemeProvider } from '../src/helpers/theme';
import { GlobalStyle } from '../src/helpers/GlobalStyle';
import { captureException, initSentry } from '../src/helpers/sentry';
import { prod, doShortenerRedirect } from '../src/services/helpers';
import { PROJECT_NAME } from '../src/services/project';

if (prod) {
  initSentry();
}

type Props = AppProps & EmotionCacheProviderProps;

export default class MyApp extends App<Props> {
  componentDidMount() {
    // setTimeout(() => {
    //   // TODO find a way to load both pages only once (they contain same code)
    //   //  OR maybe split the different next pages to contain just specific Panel (and move App.tsx to _app.tsx)
    //   Router.prefetch('/'); // works only in PROD
    //   Router.prefetch('/[osmtype]/[osmid]');
    // }, 500);
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, errorInfo);
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, emotionCache } = this.props as any;
    const { userThemeCookie } = pageProps;

    return (
      <>
        <Head>
          <title>{PROJECT_NAME}</title>
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1"
          />
        </Head>
        <AppCacheProvider emotionCache={emotionCache}>
          <UserThemeProvider userThemeCookie={userThemeCookie}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
            <GlobalStyle />
          </UserThemeProvider>
        </AppCacheProvider>
      </>
    );
  }
}

MyApp.getInitialProps = async ({ ctx, Component }) => {
  if (doShortenerRedirect(ctx)) {
    return { pageProps: undefined };
  }

  const pageProps = await Component.getInitialProps?.(ctx);
  const { userTheme } = nextCookies(ctx);

  return {
    pageProps: {
      ...pageProps,
      userThemeCookie: userTheme,
    },
  };
};
