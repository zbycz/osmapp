import React, { useEffect } from 'react';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import nextCookies from 'next-cookies';
import { CssBaseline } from '@mui/material';
import {
  AppCacheProvider,
  EmotionCacheProviderProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import { UserThemeProvider } from '../src/helpers/theme';
import { GlobalStyle } from '../src/helpers/GlobalStyle';
import { doShortenerRedirect } from '../src/services/helpers';
import { PROJECT_ID } from '../src/services/project';
import { GoogleAnalytics } from '../src/components/App/google-analytics';
import { Umami } from '../src/components/App/umami';
import { SnackbarProvider } from '../src/components/utils/SnackbarContext';
import { UserSettingsProvider } from '../src/components/utils/userSettings/UserSettingsContext';
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
import Router from 'next/router';
import { fetchSchemaTranslations } from '../src/services/tagging/translations';
import Head from 'next/head';
import { HotJar } from '../src/components/App/hotjar';
import { TicksProvider } from '../src/components/FeaturePanel/Climbing/Ticks/TicksContext';

const getInitialToast = (featureFromRouter: Feature | '404') =>
  featureFromRouter === '404'
    ? {
        message: t('url_not_found_toast'),
        severity: 'warning' as const,
        action: undefined,
      }
    : undefined;

const reactQueryClient = new QueryClient();

type OwnProps = {
  userThemeCookie: string;
  featureFromRouter: Feature | '404' | null;
  initialMapView: View;
  cookies: Record<string, string>;
};

type Props = AppProps & EmotionCacheProviderProps & OwnProps;

const MyApp = (props: Props) => {
  const {
    Component,
    pageProps,
    emotionCache,
    userThemeCookie,
    initialMapView,
    cookies,
    featureFromRouter,
  } = props;
  const mapView = getMapViewFromHash() || initialMapView;
  const initialToast = getInitialToast(featureFromRouter);

  useEffect(() => {
    setTimeout(() => {
      Router.prefetch('/'); // works only in PROD
      Router.prefetch('/directions/[[...all]]');
      fetchSchemaTranslations();
    }, 1000);
  }, []);

  return (
    <>
      <AppCacheProvider emotionCache={emotionCache}>
        <UserThemeProvider userThemeCookie={userThemeCookie}>
          <CssBaseline />

          <SnackbarProvider initialToast={initialToast}>
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
                        <TicksProvider>
                          <QueryClientProvider client={reactQueryClient}>
                            <Head>
                              <meta
                                name="viewport"
                                content="width=device-width, user-scalable=no, initial-scale=1"
                              />
                            </Head>
                            <Loading />
                            <SearchBox />
                            <ResponsiveFeaturePanel />
                            <HomepagePanel />
                            <Climbing />
                            <Map />
                            <TitleAndMetaTags />

                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Component {...pageProps} />
                          </QueryClientProvider>
                        </TicksProvider>
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
      <Umami />
      {PROJECT_ID === 'openclimbing' && (
        <>
          <GoogleAnalytics />
          <HotJar />
        </>
      )}
    </>
  );
};

MyApp.getInitialProps = async ({
  ctx,
  Component,
}: AppContext): Promise<OwnProps & AppInitialProps> => {
  if (doShortenerRedirect(ctx)) {
    // TODO move shortener redirect somewhere else (with use of next.config rewrites)
    return {
      cookies: undefined,
      featureFromRouter: undefined,
      initialMapView: ['', '', ''],
      userThemeCookie: '',
      pageProps: undefined,
    };
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
