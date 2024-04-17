import React, { useEffect } from 'react';

import styled from 'styled-components';
import dynamic from 'next/dynamic';
import BugReport from '@material-ui/icons/BugReport';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isDesktop, useBoolState } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { SHOW_PROTOTYPE_UI } from '../../config';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';
import { TopMenu } from './TopMenu';

const BrowserMap = dynamic(() => import('./BrowserMap'), {
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
  top: 72px;

  @media ${isDesktop} {
    top: 0;
  }
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
      <TopRight>
        <TopMenu />
        <LayerSwitcherDynamic />
      </TopRight>
      <BottomRight>
        {SHOW_PROTOTYPE_UI && <BugReportButton />}
        <MapFooter />
      </BottomRight>
      <MaptilerLogo />
    </>
  );
};

export default Map;
