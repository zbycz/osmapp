import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import { FeaturePanel } from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
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
import { useMobileMode } from '../helpers';
import { FeaturePanelInDrawer } from '../FeaturePanel/FeaturePanelInDrawer';
import { UserSettingsProvider } from '../utils/UserSettingsContext';
import { MyTicksPanel } from '../MyTicksPanel/MyTicksPanel';

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/'), { expires: 7, path: '/' }); // TODO find optimal expiration
  }, [view]);
};

export const getMapViewFromHash = () => {
  const view = global.window?.location.hash
    .substr(1)
    .split('/')
    .map(parseFloat)
    .filter((num) => !Number.isNaN(num))
    .map((num) => num.toString());
  return view?.length === 3 ? view : undefined;
};

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();

  React.useEffect(() => {
    if (feature?.center && !getMapViewFromHash()) {
      const [lon, lat] = feature.center.map((deg) => deg.toFixed(4));
      setView(['17.00', lat, lon]);
    }
  }, [feature]);
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
  }, []);
};

const IndexWithProviders = () => {
  const isMobileMode = useMobileMode();
  const { feature, featureShown } = useFeatureContext();
  const router = useRouter();
  useUpdateViewFromFeature();
  usePersistMapView();
  useUpdateViewFromHash();

  // TODO add correct error boundaries

  const isClimbingDialogShown = router.query.all?.[2] === 'climbing';
  const photo = router.query.all?.[3];

  return (
    <>
      <Loading />
      <SearchBox />
      {featureShown && !isMobileMode && <FeaturePanel />}
      {featureShown && isMobileMode && <FeaturePanelInDrawer />}
      {isClimbingDialogShown && (
        <ClimbingContextProvider feature={feature}>
          <ClimbingCragDialog photo={photo} />
        </ClimbingContextProvider>
      )}
      <HomepagePanel />
      {router.pathname === '/my-ticks' && <MyTicksPanel />}
      {router.pathname === '/install' && <InstallDialog />}
      <Map />
      <TitleAndMetaTags />
    </>
  );
};

const App = ({ featureFromRouter, initialMapView, cookies }) => {
  const mapView = getMapViewFromHash() || initialMapView;

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
                  <IndexWithProviders />
                </EditDialogProvider>
              </StarsProvider>
            </OsmAuthProvider>
          </MapStateProvider>
        </FeatureProvider>
      </UserSettingsProvider>
    </SnackbarProvider>
  );
};
App.getInitialProps = async (ctx) => {
  await setIntlForSSR(ctx); // needed for lang urls like /es/node/123

  const cookies = nextCookies(ctx);
  const featureFromRouter = await getInitialFeature(ctx);
  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView, cookies };
};

export default App;
