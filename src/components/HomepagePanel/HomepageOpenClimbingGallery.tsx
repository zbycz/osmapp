import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import Link from 'next/link';
import { intl, t } from '../../services/intl';
import React from 'react';
import { Typography } from '@mui/material';

const HOMEPAGE_GALLERY_HEIGHT = 200;

const data = [
  {
    href: '/relation/17262675',
    src: '/images/homepage/hlubocepske-plotny',
    children: 'Hlubočepské plotny 🇨🇿',
  },
  {
    href: '/relation/17696060',
    src: '/images/homepage/frankenjura',
    children: 'Frankenjura 🇩🇪',
  },
  {
    href: '/relation/17470613',
    src: '/images/homepage/alkazar',
    children: 'Alkazar 🇨🇿',
  },
  {
    href: '/relation/19250793',
    src: '/images/homepage/sokoliki',
    children: 'Sokoliki 🇵🇱',
  },
  {
    href: '/relation/14297763',
    src: '/images/homepage/velka',
    children: 'Velká (Vltavská žula) 🇨🇿',
  },
  {
    href: '/relation/18501782',
    src: '/images/homepage/geyikbayiri',
    children: 'Geyikbayırı 🇹🇷',
  },
  {
    href: '/relation/17130099',
    src: '/images/homepage/roviste',
    children: 'Roviště 🇨🇿',
  },
  {
    href: '/relation/19257709',
    src: '/images/homepage/szklarska-poreba',
    children: 'Szklarska Poręba 🇵🇱',
  },
  {
    href: '/relation/18647139',
    src: '/images/homepage/san-bartolo',
    children: 'San Bartolo 🇪🇸',
  },
  {
    href: '/relation/18452584',
    src: '/images/homepage/rochlitz',
    children: 'Rochlitz 🇩🇪',
  },
  {
    href: '/relation/18478296',
    src: '/images/homepage/timpa-rossa',
    children: 'Timpa Rossa 🇮🇹',
  },
  {
    href: '/relation/18218704',
    src: '/images/homepage/rastenfeld',
    children: 'Rastenfeld 🇦🇹',
  },
  {
    href: '/relation/17142287',
    src: '/images/homepage/lomy-nad-velkou',
    children: 'Lomy nad Velkou 🇨🇿',
  },
  {
    href: '/relation/17400318',
    src: '/images/homepage/kobyla',
    children: 'Kobyla 🇨🇿',
  },
  {
    href: '/relation/18286650',
    src: '/images/homepage/ratao',
    children: 'Ratão 🇵🇹',
  },
  {
    href: '/relation/14297668',
    src: '/images/homepage/jickovice',
    children: 'Jickovice 🇨🇿',
  },
  {
    href: '/relation/17301396',
    src: '/images/homepage/tetinske-skaly',
    children: 'Tetínské skály 🇨🇿',
  },
  {
    href: '/relation/17416413',
    src: '/images/homepage/solvayovy-lomy',
    children: 'Solvayovy lomy 🇨🇿',
  },
  {
    href: '/relation/17399801',
    src: '/images/homepage/u-zidovy-strouhy',
    children: 'U Židovy strouhy 🇨🇿',
  },
  // {
  //   href: '/relation/17424002',
  //   src: '/images/homepage/udoli-kacaku',
  //   children: 'Údolí Kačáku 🇨🇿',
  // },
  // {
  //   href: '/relation/17129044',
  //   src: '/images/homepage/zupanovice',
  //   children: 'Županovice 🇨🇿',
  // },
];

export const DiscoveryMoreText = styled.div`
  text-transform: lowercase;
  font-weight: normal;
  margin-bottom: 8px;
  line-height: 2.5;
`;
export const GalleryWrapper = styled.div`
  width: calc(100% + 32px * 2);
  height: calc(
    ${HOMEPAGE_GALLERY_HEIGHT}px + 26px
  ); // 16px for scrollbar and 10px for shadow
  min-height: calc(
    ${HOMEPAGE_GALLERY_HEIGHT}px + 10px
  ); // otherwise it shrinks b/c of flex
  margin: 40px -32px 0px -32px;
`;

const Gradient = styled.div<{ blur?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  transition: all 0.2s;
  ${({ blur }) =>
    blur
      ? `-webkit-backdrop-filter: blur(22px);
  backdrop-filter: blur(22px);
  background: ${convertHexToRgba('#303030', 0.2)};
  `
      : `background: linear-gradient(
    0deg,
    ${convertHexToRgba('#303030', 0.7)}
      10%,
    transparent 40%
  );`}
`;

const Text = styled.h2<{ center: boolean }>`
  position: absolute;
  bottom: 10px;
  text-align: center;
  width: 100%;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  ${({ center }) => center === true && `top: 40%`};
`;

const StyledLink = styled(Link)`
  line-height: 0;
  display: block;
`;

const StyledScrollbars = styled(Scrollbars)`
  white-space: nowrap;
  text-align: center; // one image centering
  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

const GalleryItemContainer = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: top;
  overflow: hidden;
  margin-top: 10px;
  margin-right: 12px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  &:first-of-type {
    margin-left: 30px;
  }
  &:last-of-type {
    margin-right: 30px;
  }
`;

type GalleryItemProps = {
  children: React.ReactNode;
  src: string;
  srcSet?: string;
  href: string;
  blur?: boolean;
  center?: boolean;
  alt?: string;
  title?: string;
};

const GalleryItem = ({
  children,
  src,
  srcSet,
  href,
  blur,
  center,
  alt,
  title,
}: GalleryItemProps) => (
  <GalleryItemContainer>
    <StyledLink href={href} locale={intl.lang}>
      <>
        <img
          src={src}
          srcSet={srcSet}
          height={HOMEPAGE_GALLERY_HEIGHT}
          alt={alt}
          title={title}
        />
        <Gradient blur={blur}>
          <Text center={center}>{children}</Text>
        </Gradient>
      </>
    </StyledLink>
  </GalleryItemContainer>
);

export const HomepageOpenClimbingGallery = () => (
  <GalleryWrapper>
    <StyledScrollbars universal autoHide>
      {data.map((item) => (
        <GalleryItem
          key={item.href}
          href={item.href}
          src={`${item.src}.jpg`}
          srcSet={`${item.src}.jpg,
          ${item.src}-2.jpg 2x`}
          alt={`${t('homepage.openclimbing_climbing_area')} ${item.children}`}
          title={`${t('homepage.openclimbing_climbing_area')} ${item.children}`}
        >
          {item.children}
        </GalleryItem>
      ))}

      <GalleryItem
        blur
        center
        href="/climbing-areas"
        src="/images/homepage/solvayovy-lomy.jpg"
        alt="Solvayovy lomy"
      >
        <DiscoveryMoreText>{t('homepage.discover_more_p1')}</DiscoveryMoreText>
        370+ {t('homepage.discover_more_p2')}
      </GalleryItem>
    </StyledScrollbars>
  </GalleryWrapper>
);
