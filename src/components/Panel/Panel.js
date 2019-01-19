// @flow

import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import Property from './Property';
import LogoOsm from '../../assets/LogoOsm';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import SearchBox from '../SearchBox/SearchBox';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #fafafa;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  margin: 20px 15px;
`;

const TopPanel = styled.div`
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 12px;
  box-sizing: border-box;
`;

const StyledEdit = styled.div`
  margin: 40px 0 20px 0;
  text-align: center;
`;

const Footer = styled.div`
  color: rgba(0, 0, 0, 0.54);
  margin-top: auto;
  font-size: 1rem;
  line-height: 1.5;
`;

export const Panel = () => (
  <Wrapper>
    <TopPanel>
      <SearchBox />
    </TopPanel>
    <FeatureImage link="http://upload.zby.cz/golden-gate-bridge.jpg" />
    <Content>
      <FeatureHeading title="Billa u Golden Gatu" />
      <Property label="web" value="www.billa.cz" />
      <Property label="otevírací doba" value="neděle 9-21" />
      <Property label="telefon" value="222 451 123" />

      <StyledEdit>
        <Button size="large" title="Upravit místo v živé databázi OSM">
          <LogoOsm width="24" height="24" style={{ marginRight: 10 }} />
          Upravit místo
        </Button>
      </StyledEdit>

      <Footer>
        Bod v databázi OpenStreetMap
        <br />
        50.12341° 14.5542°
        <br />
        <a href="https://osmap.cz/n2534123">osmap.cz/n2534123</a>
        <br />
        <label>
          <input type="checkbox" /> Zobrazit tagy
        </label>
      </Footer>
    </Content>
  </Wrapper>
);

export default Panel;
