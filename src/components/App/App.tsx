import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import Map from '../Map/Map';
import { SearchBox } from '../SearchBox/SearchBox';
import {
  MapStateProvider,
  useMapStateContext,
  View,
} from '../utils/MapStateContext';
import {
  getInitialFeature,
  getInitialMapView,
  getMapViewFromHash,
} from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';
import { OsmAuthProvider } from '../utils/OsmAuthContext';
import { TitleAndMetaTags } from '../../helpers/TitleAndMetaTags';
import { InstallDialog } from '../HomepagePanel/InstallDialog';
import { setIntlForSSR, t } from '../../services/intl';
import { EditDialogProvider } from '../FeaturePanel/helpers/EditDialogContext';
import { ClimbingCragDialog } from '../FeaturePanel/Climbing/ClimbingCragDialog';
import { ClimbingContextProvider } from '../FeaturePanel/Climbing/contexts/ClimbingContext';
import { StarsProvider } from '../utils/StarsContext';
import { SnackbarProvider } from '../utils/SnackbarContext';
import { UserSettingsProvider } from '../utils/UserSettingsContext';
import { MyTicksPanel } from '../MyTicksPanel/MyTicksPanel';
import { NextPage, NextPageContext } from 'next';
import { Feature } from '../../services/types';
import { ClimbingAreasPanel } from '../ClimbingAreasPanel/ClimbingAreasPanel';
import {
  ClimbingArea,
  getClimbingAreas,
} from '../../services/climbing-areas/getClimbingAreas';
import { DirectionsBox } from '../Directions/DirectionsBox';
import { ClimbingGradesTable } from '../FeaturePanel/Climbing/ClimbingGradesTable';
import { DirectionsProvider } from '../Directions/DirectionsContext';
import { ResponsiveFeaturePanel } from '../FeaturePanel/ResponsiveFeaturePanel';
import { Climbing } from '../Climbing/Climbing';

const URL_NOT_FOUND_TOAST = {
  message: t('url_not_found_toast'),
  severity: 'warning' as const,
};

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  useEffect(() => {
    window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/'), { expires: 7, path: '/' }); // TODO find optimal expiration
  }, [view]);
};

const useUpdateViewFromHash = () => {
  const { setView } = useMapStateContext();
  useEffect(() => {
    Router.beforePopState(() => {
      const mapViewFromHash = getMapViewFromHash();
      if (mapViewFromHash) {
        setView(mapViewFromHash);
      }
      return true; // let nextjs handle the route change as well
    });
  }, [setView]);
};

type IndexWithProvidersProps = {
  climbingAreas: Array<ClimbingArea>;
};

const IndexWithProviders = ({ climbingAreas }: IndexWithProvidersProps) => {
  const { featureShown } = useFeatureContext();
  usePersistMapView();
  useUpdateViewFromHash();

  // TODO add correct error boundaries

  const router = useRouter();
  const directions = router.query.all?.[0] === 'directions' && !featureShown;

  return (
    <>
      <Loading />
      {directions && (
        <DirectionsProvider>
          <DirectionsBox />
        </DirectionsProvider>
      )}
      <SearchBox />
      <ResponsiveFeaturePanel />
      <Climbing />
      <HomepagePanel />
      {router.pathname === '/my-ticks' && <MyTicksPanel />}
      {router.pathname === '/install' && <InstallDialog />}
      {router.pathname === '/climbing-grades' && <ClimbingGradesTable />}
      {climbingAreas && <ClimbingAreasPanel areas={climbingAreas} />}
      <Map />
      <TitleAndMetaTags />
    </>
  );
};

const reactQueryClient = new QueryClient();

type Props = {
  featureFromRouter: Feature | '404' | null;
  initialMapView: View;
  cookies: Record<string, string>;
  climbingAreas: Array<ClimbingArea>;
};

const App: NextPage<Props> = ({
  featureFromRouter,
  initialMapView,
  cookies,
  climbingAreas,
}) => {
  const mapView = getMapViewFromHash() || initialMapView;
  const initialToast =
    featureFromRouter === '404' ? URL_NOT_FOUND_TOAST : undefined;

  return (
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
                  <QueryClientProvider client={reactQueryClient}>
                    <IndexWithProviders climbingAreas={climbingAreas} />
                  </QueryClientProvider>
                </EditDialogProvider>
              </StarsProvider>
            </OsmAuthProvider>
          </MapStateProvider>
        </FeatureProvider>
      </UserSettingsProvider>
    </SnackbarProvider>
  );
};
App.getInitialProps = async (ctx: NextPageContext) => {
  await setIntlForSSR(ctx); // needed for lang urls like /es/node/123

  // TODO this code will have to be refactored. The idea is, that inner part of
  //  IndexWithProviders will be moved to _app.tsx and we will use proper
  //  next.js routing for each page.
  //  Catchall route will be used only for /mode* /way* /relation*
  //  This will allow us to use getServerSideProps eg for /climbing-areas
  let climbingAreas = null;
  if (ctx.pathname === '/climbing-areas') {
    climbingAreas = await getClimbingAreas();
  }

  const cookies = nextCookies(ctx);
  const featureFromRouter =
    ctx.query.all?.[0] === 'directions' ? null : await getInitialFeature(ctx);
  if (ctx.res) {
    if (featureFromRouter === '404' || featureFromRouter?.error === '404') {
      ctx.res.statusCode = 404;
    } else if (featureFromRouter?.error) {
      ctx.res.statusCode = 500;
    }
  }

  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView, cookies, climbingAreas };
};

export default App;
