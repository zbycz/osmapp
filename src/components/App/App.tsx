import React, { Ref, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import { QueryClientProvider, QueryClient } from 'react-query';
import { FeaturePanelOnSide } from '../FeaturePanel/FeaturePanelOnSide';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import {
  MapStateProvider,
  useMapStateContext,
  View,
} from '../utils/MapStateContext';
import { getInitialMapView, getInitialFeature } from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';
import { OsmAuthProvider } from '../utils/OsmAuthContext';
import { TitleAndMetaTags } from '../../helpers/TitleAndMetaTags';
import { InstallDialog } from '../HomepagePanel/InstallDialog';
import { setIntlForSSR } from '../../services/intl';
import { EditDialogProvider } from '../FeaturePanel/helpers/EditDialogContext';
import { ClimbingCragDialog } from '../FeaturePanel/Climbing/ClimbingCragDialog';
import { ClimbingContextProvider } from '../FeaturePanel/Climbing/contexts/ClimbingContext';
import { StarsProvider } from '../utils/StarsContext';
import { SnackbarProvider } from '../utils/SnackbarContext';
import { useIsClient, useMobileMode } from '../helpers';
import { FeaturePanelInDrawer } from '../FeaturePanel/FeaturePanelInDrawer';
import { UserSettingsProvider } from '../utils/UserSettingsContext';
import { MyTicksPanel } from '../MyTicksPanel/MyTicksPanel';
import { NextPage, NextPageContext } from 'next';
import { Feature } from '../../services/types';
import Error from 'next/error';
import { ClimbingAreasPanel } from '../ClimbingAreasPanel/ClimbingAreasPanel';
import {
  ClimbingArea,
  getClimbingAreas,
} from '../../services/climbing-areas/getClimbingAreas';
import { DirectionsBox } from '../Directions/DirectionsBox';
import { Scrollbars } from 'react-custom-scrollbars';

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  useEffect(() => {
    window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/'), { expires: 7, path: '/' }); // TODO find optimal expiration
  }, [view]);
};

export const getMapViewFromHash = (): View | undefined => {
  const view = global.window?.location.hash
    .substring(1)
    .split('/')
    .map(parseFloat) //we want to parse numbers, then serialize back in usePersistMapView()
    .filter((num) => !Number.isNaN(num))
    .map((num) => num.toString());
  return view?.length === 3 ? (view as View) : undefined;
};

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();

  React.useEffect(() => {
    if (!feature?.center) return;
    if (getMapViewFromHash()) return;

    const [lon, lat] = feature.center.map((deg) => deg.toFixed(4));
    setView(['17.00', lat, lon]);
  }, [feature, setView]);
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

const useScrollToTopWhenRouteChanged = () => {
  const isMobileMode = useMobileMode();
  const desktopScrollRef = useRef<Scrollbars>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = isMobileMode ? mobileScrollRef : desktopScrollRef;
  const router = useRouter();

  useEffect(() => {
    const routeChangeComplete = () => {
      if (scrollRef?.current) {
        if (isMobileMode) {
          (scrollRef as any).current.scrollTo(0, 0);
        } else {
          (scrollRef as any).current.scrollToTop();
        }
      }
    };
    router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, [isMobileMode, router.events, scrollRef]);

  return scrollRef;
};

const IndexWithProviders = ({ climbingAreas }: IndexWithProvidersProps) => {
  const isMobileMode = useMobileMode();
  const { feature, featureShown } = useFeatureContext();
  const router = useRouter();
  const isMounted = useIsClient();
  const scrollRef = useScrollToTopWhenRouteChanged() as any;
  useUpdateViewFromFeature();
  usePersistMapView();
  useUpdateViewFromHash();

  // TODO add correct error boundaries

  const isClimbingDialogShown = router.query.all?.[2] === 'climbing';
  const photo =
    router.query.all?.[3] === 'photo' ? router.query.all?.[4] : undefined;
  const routeNumber =
    router.query.all?.[3] === 'route' ? router.query.all?.[4] : undefined;

  const directions = router.query.all?.[0] === 'directions' && !featureShown;

  return (
    <>
      <Loading />
      {!directions && <SearchBox />}
      {directions && <DirectionsBox />}
      {featureShown && !isMobileMode && isMounted && (
        <FeaturePanelOnSide scrollRef={scrollRef} />
      )}
      {featureShown && isMobileMode && (
        <FeaturePanelInDrawer scrollRef={scrollRef} />
      )}
      {isClimbingDialogShown && (
        <ClimbingContextProvider feature={feature}>
          <ClimbingCragDialog
            photo={photo}
            routeNumber={routeNumber ? parseFloat(routeNumber) : undefined}
          />
        </ClimbingContextProvider>
      )}
      <HomepagePanel />
      {router.pathname === '/my-ticks' && <MyTicksPanel />}
      {router.pathname === '/install' && <InstallDialog />}
      {climbingAreas && <ClimbingAreasPanel areas={climbingAreas} />}
      <Map />
      <TitleAndMetaTags />
    </>
  );
};

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
  const queryClient = new QueryClient();

  if (featureFromRouter === '404') {
    return <Error statusCode={404} />;
  }

  return (
    <SnackbarProvider>
      <UserSettingsProvider>
        <FeatureProvider
          featureFromRouter={featureFromRouter}
          cookies={cookies}
        >
          <MapStateProvider initialMapView={mapView}>
            <OsmAuthProvider cookies={cookies}>
              <StarsProvider>
                <EditDialogProvider /* TODO supply router.query */>
                  <QueryClientProvider client={queryClient}>
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
