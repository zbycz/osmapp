// @flow

import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import Panel from '../components/Panel/Panel';
import Map from '../components/Map/Map';
import { getFeatureFromApi } from '../services/osmApi';
import { getShortId } from '../services/helpers';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  & > div {
    flex: 1;
  }
`;

const getInitialProps = async ({ query }) => {
  try {
    const initialFeature = await getFeatureFromApi(query.id || 'w316427435');
    return { initialFeature };
  } catch (e) {
    return { initialFeature: await getFeatureFromApi('w316427435') };
  }
};

const Index = ({ initialFeature }) => {
  const [feature, setFeature] = React.useState(initialFeature);
  const setFeatureHandler = feature => {
    if (feature.nonOsmObject) {
      Router.push('/', '/', { shallow: true });
    } else {
      const id = getShortId(feature.osmMeta);
      Router.push('/', `/?id=${id}`, { shallow: true });
    }
    setFeature(feature);
  };

  return (
    <Wrapper>
      <Panel feature={feature} />
      <Map onFeatureClicked={setFeatureHandler} />
    </Wrapper>
  );
};
Index.getInitialProps = getInitialProps;

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default Index;
