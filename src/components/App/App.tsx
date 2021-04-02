import React, { useLayoutEffect, useState } from 'react';
import Cookies from 'js-cookie';

import FeaturePanel from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInititalFeature } from './helpers';
import { Feature } from '../../services/types';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';

const useFeatureState = (featureFromRouter) => {
  // TODO refactor to context provider
  const [feature, setFeature] = useState(featureFromRouter);

  useLayoutEffect(() => {
    // set feature fetched by next.js router
    setFeature(featureFromRouter);
  }, [featureFromRouter]);

  // setFeature - used only for skeletons (otherwise it gets loaded by router)
  return [feature, setFeature];
};

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/')); // TODO longer expire
  }, [view]);
};

interface Props {
  featureFromRouter: Feature | null;
}

const IndexWithProviders = ({ featureFromRouter }: Props) => {
  usePersistMapView();

  const [feature, setFeature] = useFeatureState(featureFromRouter);
  const featureShown = feature != null;

  return (
    <>
      <SearchBox featureShown={featureShown} setFeature={setFeature} />
      <Loading />
      {featureShown && <FeaturePanel feature={feature} />}
      {!featureShown && <HomepagePanel />}
      <Map setFeature={setFeature} />
    </>
  );
};

const getMapViewFromHash = () =>
  typeof window !== 'undefined' &&
  window.location.hash &&
  window.location.hash.substr(1).split('/'); // TODO return only valid mapView

const App = ({ featureFromRouter, initialMapView }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <MapStateProvider initialMapView={mapView}>
      <IndexWithProviders featureFromRouter={featureFromRouter} />
    </MapStateProvider>
  );
};
App.getInitialProps = async (ctx) => {
  const featureFromRouter = await getInititalFeature(ctx);
  const initialMapView = await getInitialMapView(ctx, featureFromRouter);
  return { featureFromRouter, initialMapView };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default App;
