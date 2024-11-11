import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import Link from 'next/link';
import { intl, t } from '../../services/intl';
import React from 'react';

const HOMEPAGE_GALLERY_HEIGHT = 200;

const data = [
  {
    href: '/relation/17262675',
    src: '/images/homepage/hlubocepske-plotny',
    children: 'Hlubočepské plotny',
  },
  {
    href: '/relation/17696060',
    src: '/images/homepage/frankenjura',
    children: 'Frankenjura',
  },
  {
    href: '/relation/17130099',
    src: '/images/homepage/roviste',
    children: 'Roviště',
  },
  {
    href: '/relation/17416413',
    src: '/images/homepage/solvayovy-lomy',
    children: 'Solvayovy lomy',
  },
  {
    href: '/relation/17142287',
    src: '/images/homepage/lomy-nad-velkou',
    children: 'Lomy nad Velkou',
  },
  {
    href: '/relation/17424002',
    src: '/images/homepage/udoli-kacaku',
    children: 'Údolí Kačáku',
  },
  {
    href: '/relation/17400318',
    src: '/images/homepage/kobyla',
    children: 'Kobyla',
  },
  {
    href: '/relation/17129044',
    src: '/images/homepage/zupanovice',
    children: 'Županovice',
  },
  {
    href: '/relation/17301396',
    src: '/images/homepage/tetinske-skaly',
    children: 'Tetínské skály',
  },
  {
    href: '/relation/17399801',
    src: '/images/homepage/u-zidovy-strouhy',
    children: 'U Židovy strouhy',
  },
];

export const GalleryWrapper = styled.div`
  width: calc(100% + 32px * 2);
  height: calc(${HOMEPAGE_GALLERY_HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(
    ${HOMEPAGE_GALLERY_HEIGHT}px + 10px
  ); // otherwise it shrinks b/c of flex
  margin: 40px -32px 0px -32px;
`;

const Gradient = styled.div<{ blur?: boolean }>`
  position: absolute;
  width: 100%;
  height: calc(100% - 6px);
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

const Text = styled.div<{ center: boolean }>`
  position: absolute;
  bottom: 12px;
  text-align: center;
  width: 100%;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  ${({ center }) => center === true && `top: 35%`};
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: ${HOMEPAGE_GALLERY_HEIGHT}px;
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
  margin-right: 12px;
  cursor: pointer;
  &:first-of-type {
    margin-left: 30px;
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
};

const GalleryItem = ({
  children,
  src,
  srcSet,
  href,
  blur,
  center,
  alt,
}: GalleryItemProps) => (
  <GalleryItemContainer>
    <Link href={href} locale={intl.lang}>
      <>
        <img
          src={src}
          srcSet={srcSet}
          height={HOMEPAGE_GALLERY_HEIGHT}
          alt={alt}
        />
        <Gradient blur={blur}>
          <Text center={center}>{children}</Text>
        </Gradient>
      </>
    </Link>
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
          alt={item.children}
        >
          {item.children}
        </GalleryItem>
      ))}

      <GalleryItem
        blur
        center
        href="/climbing-areas"
        src="/images/homepage/solvayovy-lomy.jpg"
      >
        {t('homepage.discover_more_p1')}
        <br />
        <h2>370+ {t('homepage.discover_more_p2')}</h2>
      </GalleryItem>
    </StyledScrollbars>
  </GalleryWrapper>
);
