// @flow

import * as React from 'react';
import styled from 'styled-components';

import Property from './Property';

const Wrapper = styled.div`
  background-color: #fafafa;
  height: 100%;
`;

const TopPanel = styled.div`
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 12px;
  box-sizing: border-box;
`;

const SearchBox = styled.div`
  height: 48px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  background-color: #fafafa;
`;

const FeatureImage = styled.div`
  position: relative;
  background: url(${({ link }) => link}) center center no-repeat;
  background-size: cover;
  height: 238px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
        to bottom,
        rgba(55, 71, 79, 0.16),
        rgba(55, 71, 79, 0.16)
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0) 71%, #000000);
    // background-image: linear-gradient(to bottom right,#002f4b,#dc4225);
    // opacity: .6;
  }
`;

const FeatureHeading = styled.div`
  font-family: Roboto;
  font-size: 36px;
  line-height: 0.89;
  color: rgba(0, 0, 0, 0.7);
  margin: 20px 15px;
`;

export const Panel = () => (
  <Wrapper>
    <TopPanel>
      <SearchBox />
    </TopPanel>
    <FeatureImage link="https://cdn.pixabay.com/photo/2014/07/10/10/20/golden-gate-bridge-388917_960_720.jpg" />
    <FeatureHeading>Billa Golden Gate Bridge</FeatureHeading>
    <Property label="web" value="www.billa.cz" />
    <Property label="otevírací doba" value="neděle 9-21" />
    <Property label="telefon" value="222 451 123" />
  </Wrapper>
);

export default Panel;
