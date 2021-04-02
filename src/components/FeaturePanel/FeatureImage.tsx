import React, { ReactNode } from 'react';

import styled from 'styled-components';
import Head from 'next/head';
import { getFeatureImage, LOADING } from '../../services/images';
import { Feature } from '../../services/types';
import { InlineSpinner } from './FeatureImage/InlineSpinner';

const Wrapper = styled.div`
  position: relative;
  background: #ddd url(${({ link }) => link ?? ''}) center center no-repeat;
  background-size: ${({ portrait }) => (portrait ? 'contain' : 'cover')};
  height: 238px;
  min-height: 238px; /* otherwise it shrinks b/c of flex*/
  ${({ uncertainImage }) => (uncertainImage ? 'filter: grayscale(100%);' : '')}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.15) 76%,
      #000000
    );
    // background-image: linear-gradient(to bottom right,#002f4b,#dc4225);
    opacity: 0.6;
  }
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
`;

const IconWrapper = styled.div`
  padding-top: 40px;
  text-align: center;
  svg,
  img {
    width: 100px;
    height: 100px;
    color: #eee;
  }
  img {
    opacity: 0.15;
  }
`;

const Attribution = styled.a`
  position: absolute;
  right: 1px;
  top: 1px;
  text-align: right;
  padding-right: 3px;
  font-size: 80%;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 1);
  color: #fff;
  text-decoration: none;
  opacity: ${({ portrait }) => (portrait ? 1 : 0.8)};

  &:hover {
    opacity: 1;
    text-shadow: 1px 1px 10px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
  }
`;

interface Props {
  feature: Feature;
  ico: string;
  children: ReactNode;
}

const FeatureImage = ({ feature, ico, children }: Props) => {
  const [image, setImage] = React.useState(feature.ssrFeatureImage ?? LOADING);

  React.useEffect(() => {
    if (feature.ssrFeatureImage) return;

    setImage(LOADING);
    getFeatureImage(feature).then(
      (newImage) => {
        setImage(newImage);
      },
      (e) => {
        console.warn('getFeatureImage rejected: ', e); // eslint-disable-line no-console
        setImage(undefined);
      },
    );
  }, [feature]);

  const { source, link, thumb, username, portrait } = image ?? {};

  return (
    <Wrapper
      link={thumb}
      uncertainImage={source === 'Mapillary'}
      portrait={portrait}
    >
      {(image === undefined || image === LOADING) && (
        <IconWrapper>
          <img src={`/icons/${ico}_11.svg`} alt={ico} title={ico} />
        </IconWrapper>
      )}
      {source && (
        <Attribution
          href={link}
          title={`© ${source}${username ? ` / ${username}` : ''}`}
          target="_blank"
          rel="noopener"
          portrait={portrait}
        >
          {`${source}${username ? ` / ${username}` : ''}`}
        </Attribution>
      )}
      {!feature.skeleton && image === LOADING && <InlineSpinner />}
      {thumb && (
        <Head>
          <meta property="og:image" content={thumb} />
        </Head>
      )}
      <Bottom>{children}</Bottom>
    </Wrapper>
  );
};

export default FeatureImage;
