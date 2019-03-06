// @flow

import * as React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

const Wrapper = styled.div`
  position: relative;
  background: url(${({ link }) => link}) center center no-repeat;
  background-size: cover;
  height: 238px;
  min-height: 238px; /* otherwise it shrinks b/c of flex*/

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

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
`;

const FeatureImage = ({ link, children }) => (
  <Wrapper link={link}>
    <Bottom>{children}</Bottom>
  </Wrapper>
);

export default FeatureImage;
