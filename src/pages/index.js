// @flow

import React from 'react';
import styled from 'styled-components';

import Panel from '../components/Panel/Panel';
import Map from '../components/Map/Map';
import { getFeatureFromApi } from '../services/osmApi';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  width: 100%;
  height: 100%;

  & > div {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
`;

const getInitialProps = async ctx => {
  const initialFeature = await getFeatureFromApi('n4171192706');
  return { initialFeature };
};

const Index = ({ initialFeature }) => {
  const [feature, setFeature] = React.useState(initialFeature);

  return (
    <Wrapper>
      <Panel feature={feature} />
      <Map onFeatureClicked={setFeature} />
    </Wrapper>
  );
};
Index.getInitialProps = getInitialProps;

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default Index;
