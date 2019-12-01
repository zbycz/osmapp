// @flow

import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import Panel from '../components/Panel/Panel';
import Map from '../components/Map/Map';
import { getFeatureFromApi } from '../services/osmApi';
import { getShortId } from '../services/helpers';
import SearchBox from '../components/SearchBox/SearchBox';

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

const getInitialFeature = async id => {
  try {
    return id ? await getFeatureFromApi(id) : null;
  } catch (e) {
    return null;
  }
};

const getInitialProps = async ({ query }) => ({
  initialFeature: await getInitialFeature(query.id),
});

const Index = ({ initialFeature }) => {
  const [feature, setFeature] = React.useState(initialFeature);
  const setFeatureHandler = feature => {
    if (feature == null || feature.nonOsmObject) {
      Router.push('/', '/', { shallow: true });
    } else {
      const id = getShortId(feature.osmMeta);
      Router.push('/', `/?id=${id}`, { shallow: true });
    }
    setFeature(feature);
  };

  return (
    <>
      <TopPanel>
        <SearchBox resetFeature={() => setFeatureHandler(null)} />
      </TopPanel>
      {feature != null && <Panel feature={feature} />}
      <Map onFeatureClicked={setFeatureHandler} />
    </>
  );
};
Index.getInitialProps = getInitialProps;

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default Index;
