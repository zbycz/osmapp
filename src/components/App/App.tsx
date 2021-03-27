import React from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

import Panel from '../Panel/Panel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInititalFeature } from './helpers';
import { Feature } from '../../services/types';

const getUrl = ({ type, id }) => `${type}/${id}`;

const persistFeature = (feature) => {
  const hasUrl = feature && !feature.nonOsmObject;
  const url = hasUrl ? getUrl(feature.osmMeta) : '';
  Router.push('/', `/${url}${window.location.hash}`, { shallow: true });
};

const useFeatureState = (initialFeature) => {
  const [feature, setFeature] = React.useState(initialFeature);
  const setFeatureAndPersist = React.useCallback(
    (newFeature) => {
      persistFeature(newFeature);
      setFeature(newFeature);
    },
    [setFeature],
  );

  // set correct url in browser
  React.useEffect(() => {
    setFeatureAndPersist(initialFeature);
  }, []);

  return [feature, setFeatureAndPersist];
};

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/')); // TODO longer expire
  }, [view]);
};

interface Props {
  initialFeature: Feature | null;
}

const IndexWithProviders = ({ initialFeature }: Props) => {
  const [feature, setFeature] = useFeatureState(initialFeature);
  usePersistMapView();

  return (
    <>
      <SearchBox feature={feature} setFeature={setFeature} />
      {feature != null && <Panel feature={feature} />}
      <Map onFeatureClicked={setFeature} />
    </>
  );
};

const getMapViewFromHash = () =>
  typeof window !== 'undefined' &&
  window.location.hash &&
  window.location.hash.substr(1).split('/'); // TODO return only valid mapView

const App = ({ initialFeature, initialMapView }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <MapStateProvider initialMapView={mapView}>
      <IndexWithProviders initialFeature={initialFeature} />
    </MapStateProvider>
  );
};
App.getInitialProps = async (ctx) => {
  const initialFeature = await getInititalFeature(ctx);
  const initialMapView = await getInitialMapView(ctx, initialFeature);
  return { initialFeature, initialMapView };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default App;
