import React, { useEffect } from 'react';

import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import BugReport from '@mui/icons-material/BugReport';
import { Button, CircularProgress } from '@mui/material';
import { isDesktop, useBoolState } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';
import { TopMenu } from './TopMenu/TopMenu';
import { useMapStateContext } from '../utils/MapStateContext';
import { Weather } from './Weather/Weather';

const BrowserMapDynamic = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => <div />,
});

const LayerSwitcherDynamic = dynamic(
  () => import('../LayerSwitcher/LayerSwitcher'),
  {
    ssr: false,
    loading: () => <LayerSwitcherButton />,
  },
);

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
`;

const TopRight = styled.div`
  position: absolute;
  z-index: 1000;
  padding: 10px;
  right: 0;
  top: calc(env(safe-area-inset-top) + 62px);

  @media ${isDesktop} {
    top: 0;
  }
`;

const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  z-index: 1000;
  text-align: right;
  pointer-events: none;
  z-index: 999;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: end;
  padding: 0 4px 4px 4px;
`;

const NoscriptMessage = () => (
  <noscript>
    <span style={{ position: 'absolute', left: '50%', top: '50%' }}>
      This map needs Javascript.
    </span>
  </noscript>
);

const TopBlur = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: env(safe-area-inset-top);
  backdrop-filter: blur(4px);
`;

const Map = () => {
  const { mapLoaded } = useMapStateContext();

  return (
    <>
      <BrowserMapDynamic />
      <TopBlur />
      {!mapLoaded && <Spinner color="secondary" />}
      <NoscriptMessage />
      <TopRight>
        <TopMenu />
        <LayerSwitcherDynamic />
      </TopRight>
      <BottomRight>
        <MaptilerLogo />
        <Weather />
        <MapFooter />
      </BottomRight>
    </>
  );
};

export default Map;
