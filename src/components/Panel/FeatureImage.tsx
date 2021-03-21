import * as React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ReactNode } from 'react';
import { getFeatureImage, LOADING } from '../../services/images';
import LogoOsmapp from '../../assets/LogoOsmapp';
import { Feature } from '../../services/types';

const Wrapper = styled.div`
  position: relative;
  background: #ddd url(${({ link }) => link ?? ''}) center center no-repeat;
  background-size: ${({ portrait }) => (portrait ? 'contain' : 'cover')};
  height: 238px;
  min-height: 238px; /* otherwise it shrinks b/c of flex*/
  ${({ uncertain }) => (uncertain ? 'filter: grayscale(100%);' : '')}

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

const Spinner = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  margin: -20px 0 0 -20px;
  div {
    position: absolute;
    svg {
      color: #ccc;
    }
  }
  svg.logo {
    margin: 10px;
  }
`;

const Attribution = styled.a`
  position: absolute;
  right: 0;
  top: 0;
  // display: flex;
  // align-items: center;
  // width: 100%;
  text-align: right;
  padding-right: 3px;
  font-size: 80%;
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
  color: #fff;
  text-decoration: none;
  opacity: ${({ portrait }) => (portrait ? 1 : 0.5)};
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
      uncertain={source === 'Mapillary'}
      portrait={portrait}
    >
      {image === undefined && (
        <IconWrapper>
          <img src={`/maki/${ico}-11.svg`} alt={ico} title={ico} />
        </IconWrapper>
      )}
      {image === LOADING && (
        <Spinner>
          <CircularProgress />
          <LogoOsmapp width={20} height={20} className="logo" />
        </Spinner>
      )}
      {source && (
        <Attribution
          href={link}
          title={`© ${source}${username ? `, ${username}` : ''}`}
          target="_blank"
          rel="noopener"
          portrait={portrait}
        >
          {username ?? source}
        </Attribution>
      )}
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
