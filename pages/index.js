// @flow

import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';

import Panel from '../src/components/Panel/Panel';
import Map from '../src/components/Map/Map';
import { getFeatureFromApi } from '../src/services/osmApi';
import { getShortId } from '../src/services/helpers';
import SearchBox from '../src/components/SearchBox/SearchBox';
import {
  MapStateProvider,
  useMapStateContext,
} from '../src/components/utils/MapStateContext';
import { getFeatureImage } from '../src/services/images';

const TopPanel = styled.div`
  position: absolute;
  width: 410px;
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 12px;
  box-sizing: border-box;

  z-index: 1200;
`;

const fetchInitialFeature = async id => {
  try {
    return id ? await getFeatureFromApi(id) : null;
  } catch (e) {
    return null;
  }
};

const persistFeatureId = id => {
  const url = id ? `?id=${id}` : '';
  Router.push('/', `/${url}${location.hash}`, { shallow: true });
  Cookies.set('lastFeatureId', id); // TODO longer expire
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
      <TopPanel>
        <SearchBox resetFeature={() => setFeature(null)} />
      </TopPanel>
      {feature != null && <Panel feature={feature} />}
      <Map onFeatureClicked={setFeature} />
    </>
  );
};

const Index = ({ initialFeature, initialMapState }) => {
  return (
    <MapStateProvider initialMapState={initialMapState}>
      <IndexWithProviders initialFeature={initialFeature} />
    </MapStateProvider>
  );
};
Index.getInitialProps = async ctx => {
  const { lastFeatureId, mapView } = nextCookies(ctx);

  const defaultView = [17, 50.10062, 14.38906];
  const initialMapState = mapView ? mapView.split('/') : defaultView;
  const shortId = ctx.query.id || lastFeatureId;
  const initialFeature = await fetchInitialFeature(shortId);
  if (initialFeature) {
    initialFeature.featureImage = await getFeatureImage(initialFeature);
  }

  return {
    initialFeature,
    initialMapState,
  };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default Index;
