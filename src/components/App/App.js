// @flow

import React from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

import Panel from '../Panel/Panel';
import Map from '../Map/Map';
import { getShortId } from '../../services/helpers';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapState, getInititalFeature } from './helpers';

const getUrl = ({type, id}) => `${type}/${id}`;

const persistFeature = feature => {
  const hasUrl = feature && !feature.nonOsmObject;
  const url = hasUrl ? getUrl(feature.osmMeta) : '';
  Router.push('/', `/${url}${location.hash}`, { shallow: true });
};

const useFeatureState = initialFeature => {
  const [feature, setFeature] = React.useState(initialFeature);
  const setFeatureAndPersist = React.useCallback(
    feature => {
      persistFeature(feature);
      setFeature(feature);
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

const IndexWithProviders = ({ initialFeature }) => {
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

const getMapStateFromHash = () =>
  typeof window !== 'undefined' &&
  window.location.hash &&
  window.location.hash.substr(1).split('/'); // TODO return only valid map state

const App = ({ initialFeature, initialMapState }) => {
  const mapState = getMapStateFromHash() || initialMapState;
  return (
    <MapStateProvider initialMapState={mapState}>
      <IndexWithProviders initialFeature={initialFeature} />
    </MapStateProvider>
  );
};
App.getInitialProps = async ctx => {
  const initialFeature = await getInititalFeature(ctx);
  const initialMapState = await getInitialMapState(ctx, initialFeature);
  return { initialFeature, initialMapState };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default App;
