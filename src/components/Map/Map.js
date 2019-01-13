// @flow

import * as React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const Wrapper = styled.div`
  background-color: gray;
  height: 100%;
`;

const MapBrowser = dynamic(() => import('./BrowserMap'), { ssr: false });

const Map = () => (
  <Wrapper>
    <MapBrowser />
  </Wrapper>
);

export default Map;
