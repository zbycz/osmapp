import React, { useEffect } from 'react';

import styled from 'styled-components';
import dynamic from 'next/dynamic';
import BugReport from '@mui/icons-material/BugReport';
import { Button, CircularProgress } from '@mui/material';
import { useBoolState } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { SHOW_PROTOTYPE_UI } from '../../config';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';

const BrowserMap = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => <div />,
});

const LayerSwitcher = dynamic(() => import('../LayerSwitcher/LayerSwitcher'), {
  ssr: false,
  loading: () => <LayerSwitcherButton />,
});

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
`;

const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1000;
  text-align: right;
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
  const [mapLoaded, setLoaded, setNotLoaded] = useBoolState(true);

  useEffect(setNotLoaded, []);

  return (
    <>
      <BrowserMap onMapLoaded={setLoaded} />
      {!mapLoaded && <Spinner color="secondary" />}
      <NoscriptMessage />
      <LayerSwitcher />
      <BottomRight>
        {SHOW_PROTOTYPE_UI && <BugReportButton />}
        <MapFooter />
      </BottomRight>
      <MaptilerLogo />
    </>
  );
};

export default Map;
