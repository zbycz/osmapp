// @flow

import * as React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import BugReport from '@material-ui/icons/BugReport';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import GithubIcon from '../../assets/GithubIcon';
import LayersIcon from '../../assets/LayersIcon';
import { useBoolState } from '../helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { useEffect } from 'react';

const BrowserMap = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => '',
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
  padding: 2px;
`;

const Box = styled.div`
  margin-top: 10px;
  padding: 2px;
  font-size: 12px;
  line-height: normal;
  color: #000;
  background-color: #f8f4f0; /* same as osm-bright */

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }
`;

const TopCenter = styled.div`
  position: absolute;
  top: 0;
  left: 48%;
  z-index: 1000;
  padding: 10px;
`;

const TopRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  padding: 10px;
`;

const LayerSwitcherButton = styled.button`
  margin: 0;
  padding: 0;
  width: 52px;
  height: 69px;
  border-radius: 5px;
  border: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.8);
  outline: 0;
  cursor: pointer;

  &:hover {
    background-color: #f2f3f2;
  }

  svg {
    margin: 4px auto 4px auto;
  }
`;

const Map = ({ onFeatureClicked }) => {
  const [mapLoaded, onMapLoaded, onStartLoading] = useBoolState(true);
  const { view } = useMapStateContext();

  useEffect(onStartLoading, []);

  return (
    <>
      <BrowserMap
        onFeatureClicked={onFeatureClicked}
        onMapLoaded={onMapLoaded}
      />
      {!mapLoaded && <Spinner color="secondary" />}
      <noscript>
        <span style={{ position: 'absolute', left: '50%', top: '50%' }}>
          This map needs Javascript.
        </span>
      </noscript>
      <TopCenter>
        <Button variant="outlined">Co je OpenStreetMap?</Button>
      </TopCenter>
      <TopRight>
        <LayerSwitcherButton>
          <LayersIcon />
          Vrstvy
        </LayerSwitcherButton>
      </TopRight>
      <BottomRight>
        <Button size="small">
          <BugReport width="10" height="10" />
          Nahlásit chybu v mapě
        </Button>
        <Box>
          <GithubIcon width="12" height="12" />
          <a href="https://github.com/zbycz/osmapp">osmapp</a> 0.1 | ©{' '}
          <a href="#">mapová data</a> |{' '}
          <a
            href={`https://www.openstreetmap.org/edit#map=${view.join('/')}`}
            title="v editoru iD"
            target="_blank"
            rel="noopener"
          >
            editovat
          </a>
        </Box>
      </BottomRight>
    </>
  );
};
//https://www.openstreetmap.org/edit?lat=50.09231&lon=14.32098&zoom=17

export default Map;
