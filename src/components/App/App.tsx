import React from 'react';
import Cookies from 'js-cookie';

import nextCookies from 'next-cookies';
import FeaturePanel from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInititalFeature } from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';
import { OsmAuthProvider } from '../utils/OsmAuthContext';
import { FeaturePreview } from '../FeaturePreview/FeaturePreview';

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/')); // TODO longer expire
  }, [view]);
};

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();
  const [lastFeature, setLastFeature] = React.useState(feature);

  React.useEffect(() => {
    const viewAlreadyUpdated = feature?.skeleton || lastFeature?.skeleton;

    if (!viewAlreadyUpdated && feature?.center) {
      const [lon, lat] = feature.center;
      setView([17.0, lat, lon]);
    }

    setLastFeature(feature);
  }, [feature]);
};

const IndexWithProviders = () => {
  const { featureShown, preview } = useFeatureContext();

  useUpdateViewFromFeature();
  usePersistMapView();

  return (
    <>
      <SearchBox />
      <Loading />
      {featureShown && <FeaturePanel />}
      {!featureShown && <HomepagePanel />}
      <Map />
      {preview && <FeaturePreview />}
    </>
  );
};

const getMapViewFromHash = () =>
  typeof window !== 'undefined' &&
  window.location.hash &&
  window.location.hash.substr(1).split('/'); // TODO return only valid mapView

const App = ({ featureFromRouter, initialMapView, hpCookie }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <FeatureProvider featureFromRouter={featureFromRouter} hpCookie={hpCookie}>
      <MapStateProvider initialMapView={mapView}>
        <OsmAuthProvider>
          <IndexWithProviders />
        </OsmAuthProvider>
      </MapStateProvider>
    </FeatureProvider>
  );
};
App.getInitialProps = async (ctx) => {
  const { hideHomepage: hpCookie } = nextCookies(ctx);
  const featureFromRouter = await getInititalFeature(ctx);
  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView, hpCookie };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default App;
