// @flow

import React from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

import Panel from '../src/components/Panel/Panel';
import Map from '../src/components/Map/Map';
import {
  getInitialMapState,
  getInititalFeature,
  getShortId,
} from '../src/services/helpers';
import SearchBox from '../src/components/SearchBox/SearchBox';
import {
  MapStateProvider,
  useMapStateContext,
} from '../src/components/utils/MapStateContext';

const persistFeatureId = id => {
  const url = id ? `?id=${id}` : '';
  Router.push('/', `/${url}${location.hash}`, { shallow: true });
};

const useFeatureState = initialFeature => {
  const [feature, setFeature] = React.useState(initialFeature);
  const setFeatureAndPersist = React.useCallback(
    feature => {
      const persistable = feature && !feature.nonOsmObject;
      const id = persistable ? getShortId(feature.osmMeta) : null;
      persistFeatureId(id);
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

function usePersistMapView() {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/')); // TODO longer expire
  }, [view]);
}

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

const Index = ({ initialFeature, initialMapState }) => {
  const mapState = getMapStateFromHash() || initialMapState;
  return (
    <MapStateProvider initialMapState={mapState}>
      <IndexWithProviders initialFeature={initialFeature} />
    </MapStateProvider>
  );
};
Index.getInitialProps = async ctx => {
  const initialFeature = await getInititalFeature(ctx);
  const initialMapState = await getInitialMapState(ctx, initialFeature);
  return { initialFeature, initialMapState };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default Index;
