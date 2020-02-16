// @flow

import * as React from 'react';
import styled from 'styled-components';
import { getFeatureImage } from '../../services/images';
import BrokenImage from '@material-ui/icons/BrokenImage';
import CircularProgress from '@material-ui/core/CircularProgress';

const Wrapper = styled.div`
  position: relative;
  background: url(${({ link }) => link ?? ''}) center center no-repeat;
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

const IconWrapper = styled.div`
  padding-top: 40px;
  text-align: center;
  svg {
    width: 100px;
    height: 100px;
    color: #eee;
  }
`;

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  top: 40%;
  margin: -20px 0 0 -20px;
  svg {
    color: #ccc;
  }
`;

const LOADING = null;

const FeatureImage = ({ feature, children }) => {
  const [link, setLink] = React.useState(LOADING);
  React.useEffect(() => {
    setLink(LOADING);
    getFeatureImage(feature).then(
      url => {
        setLink(url);
      },
      e => {
        console.warn('getFeatureImage rejected: ', e);
        setLink(undefined);
      },
    );
  }, [feature]);

  return (
    <Wrapper link={link}>
      {link === undefined && (
        <IconWrapper>
          <BrokenImage />
        </IconWrapper>
      )}
      {link === LOADING && <Spinner />}
      <Bottom>{children}</Bottom>
    </Wrapper>
  );
};

export default FeatureImage;
