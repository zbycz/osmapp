import React from 'react';

import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import BugReport from '@mui/icons-material/BugReport';
import { Button, CircularProgress } from '@mui/material';
import { isDesktop, isWideResolution } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { SHOW_PROTOTYPE_UI } from '../../config.mjs';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';
import { TopMenu } from './HamburgerMenu/TopMenu';
import { useMapStateContext } from '../utils/MapStateContext';
import { Weather } from './Weather/Weather';
import { MapFilter } from './MapFilter/MapFilter';

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
  top: 62px;
  pointer-events: none;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 8px;

  @media ${isDesktop} {
    top: 0;
  }

  @media ${isWideResolution} {
    flex-direction: row;
    align-items: center;
  }
`;

const BottomLeft = styled.div`
  position: absolute;
  left: 6px;
  bottom: 6px;
  pointer-events: none;
  z-index: 998;
`;
const BottomRight = styled.div`
  position: absolute;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 4px 4px 0;
`;

const BugReportButton = () => (
  <Button size="small">
    <BugReport width="10" height="10" />
    Nahlásit chybu v mapě
  </Button>
);

const NoscriptMessage = () => (
  <noscript>
    <span style={{ position: 'absolute', left: '50%', top: '50%' }}>
      This map needs Javascript.
    </span>
  </noscript>
);

const Map = () => {
  const { mapLoaded, activeLayers } = useMapStateContext();
  const hasClimbingLayer = activeLayers.includes('climbing');

  return (
    <>
      <BrowserMapDynamic />
      {!mapLoaded && <Spinner color="secondary" />}
      <NoscriptMessage />
      <TopRight>
        <LayerSwitcherDynamic />
        <TopMenu />
      </TopRight>
      <BottomLeft>{hasClimbingLayer && <MapFilter />}</BottomLeft>
      <BottomRight>
        {SHOW_PROTOTYPE_UI && <BugReportButton />}
        <MaptilerLogo />
        <Weather />
        <MapFooter />
      </BottomRight>
    </>
  );
};

export default Map;
