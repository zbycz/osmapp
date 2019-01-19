// @flow

import * as React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import BugReport from '@material-ui/icons/BugReport';
import Button from '@material-ui/core/Button';

import GithubIcon from '../../assets/GithubIcon';
import LayersIcon from '../../assets/LayersIcon';

const Wrapper = styled.div`
  position: relative;
  background-color: #eee;
  height: 100%;
`;

const MapBrowser = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => '',
});

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
  background-color: rgba(255, 255, 255, 0.7);

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }
`;

const Top = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  z-index: 1000;
  padding: 10px;
  width: 100%;
  align-items: flex-start;

  button:first-child {
    margin: 0 auto;
  }
`;

const LayerSwitcherButton = styled.button`
  margin: 0;
  padding: 0;
  width: 52px;
  height: 69px;
  border-radius: 5px;
  border: 0;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);
  background-color: #ffffff;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.8);
  outline: 0;
  cursor: pointer;

  svg {
    margin: 4px auto 4px auto;
  }
`;

const Map = () => (
  <Wrapper>
    <MapBrowser />
    <Top>
      <Button variant="outlined">Co je OpenStreetMap?</Button>
      <LayerSwitcherButton>
        <LayersIcon />
        Vrstvy
      </LayerSwitcherButton>
    </Top>
    <BottomRight>
      <Button size="small">
        <BugReport width="10" height="10" />
        Nahlásit chybu v mapě
      </Button>
      <Box>
        <GithubIcon width="12" height="12" />
        <a href="#">osmcz-app</a> 2.0.0 | © <a href="#">mapová data</a> |{' '}
        <a href="#" title="v editoru iD">
          editovat
        </a>
      </Box>
    </BottomRight>
  </Wrapper>
);

export default Map;
