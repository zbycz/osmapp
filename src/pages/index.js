// @flow

import React, { useState } from 'react';
import styled from 'styled-components';

import Panel from '../components/Panel/Panel';
import Map from '../components/Map/Map';

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

const Index = () => {
  const [feature, setFeature] = useState({
    properties: {
      name: 'Billa u Golden Gatu',
      web: 'www.billa.cz',
      telefon: '222 451 123',
      'otevírací doba': 'neděle 9-21',
    },
  });

  return (
    <Wrapper>
      <Panel feature={feature} />
      <Map onFeatureClicked={setFeature} />
    </Wrapper>
  );
};

export default Index;
