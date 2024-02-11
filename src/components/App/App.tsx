import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FeaturePanel } from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInititalFeature } from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';
import { OsmAuthProvider } from '../utils/OsmAuthContext';
import { FeaturePreview } from '../FeaturePreview/FeaturePreview';
import { TitleAndMetaTags } from '../../helpers/TitleAndMetaTags';
import { InstallDialog } from '../HomepagePanel/InstallDialog';
import { setIntlForSSR } from '../../services/intl';
import { EditDialogProvider } from '../FeaturePanel/helpers/EditDialogContext';
import { ClimbingDialog } from '../FeaturePanel/Climbing/ClimbingDialog';
import { ClimbingContextProvider } from '../FeaturePanel/Climbing/contexts/ClimbingContext';
import { StarsProvider } from '../utils/StarsContext';

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
  const { feature, featureShown, preview } = useFeatureContext();
  const router = useRouter();
  useUpdateViewFromFeature();
  usePersistMapView();
  useUpdateViewFromHash();

  // temporary Alert until the issue is fixed
  const [brokenShown, setBrokenShown] = React.useState(true);
  const onBrokenClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setBrokenShown(false);
    }
  };

  // TODO add correct error boundaries

  const isClimbingDialogShown = router.query.all?.[2] === 'climbing';
  return (
    <>
      <SearchBox />
      <Loading />
      {featureShown && <FeaturePanel />}
      {isClimbingDialogShown && (
        <ClimbingContextProvider feature={feature}>
          <ClimbingDialog />
        </ClimbingContextProvider>
      )}

      <HomepagePanel />
      {router.pathname === '/install' && <InstallDialog />}
      <Map />
      {preview && <FeaturePreview />}
      <TitleAndMetaTags />

      {!featureShown && !preview && (
        <Snackbar open={brokenShown} onClose={onBrokenClose}>
          <Alert onClose={onBrokenClose} severity="info" variant="outlined">
            Some clickable POIs are broken on Maptiler –{' '}
            <a
              href="https://github.com/openmaptiles/openmaptiles/issues/1587"
              style={{ textDecoration: 'underline' }}
            >
              issue here
            </a>
            .
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

const App = ({ featureFromRouter, initialMapView, hpCookie }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <FeatureProvider featureFromRouter={featureFromRouter} hpCookie={hpCookie}>
      <MapStateProvider initialMapView={mapView}>
        <OsmAuthProvider>
          <StarsProvider>
            <EditDialogProvider /* TODO supply router.query */>
              <IndexWithProviders />
            </EditDialogProvider>
          </StarsProvider>
        </OsmAuthProvider>
      </MapStateProvider>
    </FeatureProvider>
  );
};
App.getInitialProps = async (ctx) => {
  await setIntlForSSR(ctx);

  const { hideHomepage: hpCookie } = nextCookies(ctx);
  const featureFromRouter = await getInititalFeature(ctx);
  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView, hpCookie };
};

export default App;
