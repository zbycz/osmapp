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
import { doShortenerRedirect } from '../src/services/helpers';
import { PROJECT_ID, PROJECT_NAME } from '../src/services/project';
import { GoogleAnalytics } from '../src/components/App/google-analytics';
import { Umami } from '../src/components/App/umami';
import { SnackbarProvider } from '../src/components/utils/SnackbarContext';
import { UserSettingsProvider } from '../src/components/utils/UserSettingsContext';
import {
  MapStateProvider,
  View,
} from '../src/components/utils/MapStateContext';
import { OsmAuthProvider } from '../src/components/utils/OsmAuthContext';
import { EditDialogProvider } from '../src/components/FeaturePanel/helpers/EditDialogContext';
import Map from '../src/components/Map/Map';
import { TitleAndMetaTags } from '../src/helpers/TitleAndMetaTags';
import {
  getInitialFeature,
  getInitialMapView,
  getMapViewFromHash,
} from '../src/components/App/helpers';
import { FeatureProvider } from '../src/components/utils/FeatureContext';
import { StarsProvider } from '../src/components/utils/StarsContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Loading } from '../src/components/App/Loading';
import { SearchBox } from '../src/components/SearchBox/SearchBox';
import { HomepagePanel } from '../src/components/HomepagePanel/HomepagePanel';
import { setIntlForSSR, t } from '../src/services/intl';
import { Feature } from '../src/services/types';
import { ResponsiveFeaturePanel } from '../src/components/FeaturePanel/ResponsiveFeaturePanel';
import { Climbing } from '../src/components/Climbing/Climbing';

const URL_NOT_FOUND_TOAST = {
  message: t('url_not_found_toast'),
  severity: 'warning' as const,
};

const reactQueryClient = new QueryClient();

type OwnProps = {
  userThemeCookie: string;
  featureFromRouter: Feature | '404' | null;
  initialMapView: View;
  cookies: Record<string, string>;
};

type Props = AppProps & EmotionCacheProviderProps & OwnProps;

// export default class MyApp extends App<Props> {
//   componentDidMount() {
//     // setTimeout(() => {
//     //   // TODO find a way to load both pages only once (they contain same code)
//     //   //  OR maybe split the different next pages to contain just specific Panel (and move App.tsx to _app.tsx)
//     //   Router.prefetch('/'); // works only in PROD
//     //   Router.prefetch('/[osmtype]/[osmid]');
//     // }, 500);
//   }
//
//   render() {

const MyApp = (props: Props) => {
  const {
    Component,
    pageProps,
    emotionCache,
    userThemeCookie,
    initialMapView = ['4', '50', '14'],
    cookies = {},
    featureFromRouter = null,
  } = props;
  const mapView = getMapViewFromHash() || initialMapView;

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

          <SnackbarProvider initialToast={undefined}>
            <UserSettingsProvider>
              <FeatureProvider
                featureFromRouter={
                  featureFromRouter === '404' ? null : featureFromRouter
                }
                cookies={cookies}
              >
                <MapStateProvider initialMapView={mapView}>
                  <OsmAuthProvider cookies={cookies}>
                    <StarsProvider>
                      <EditDialogProvider /* TODO supply router.query */>
                        <QueryClientProvider client={reactQueryClient}>
                          <Loading />
                          <SearchBox />
                          <ResponsiveFeaturePanel />
                          <Climbing />
                          <Map />
                          <TitleAndMetaTags />

                          <Component {...pageProps} />
                          <HomepagePanel />
                        </QueryClientProvider>
                      </EditDialogProvider>
                    </StarsProvider>
                  </OsmAuthProvider>
                </MapStateProvider>
              </FeatureProvider>
            </UserSettingsProvider>
          </SnackbarProvider>

          <GlobalStyle />
        </UserThemeProvider>
      </AppCacheProvider>
      {PROJECT_ID === 'openclimbing' && (
        <>
          <GoogleAnalytics />
          <Umami />
        </>
      )}
    </>
  );
};
// }

MyApp.getInitialProps = async ({ ctx, Component }) => {
  if (doShortenerRedirect(ctx)) {
    return { pageProps: undefined };
  }

  await setIntlForSSR(ctx); // needed for lang urls like /es/node/123

  const pageProps = await Component.getInitialProps?.(ctx);
  const { userTheme } = nextCookies(ctx);

  const cookies = nextCookies(ctx);

  const featureFromRouter = await getInitialFeature(ctx);
  if (ctx.res) {
    if (featureFromRouter === '404' || featureFromRouter?.error === '404') {
      ctx.res.statusCode = 404;
    } else if (featureFromRouter?.error) {
      ctx.res.statusCode = 500;
    }
  }

  const initialMapView = await getInitialMapView(ctx);

  return {
    featureFromRouter,
    initialMapView,
    cookies,
    userThemeCookie: userTheme,
    pageProps,
  };
};

export default MyApp;
