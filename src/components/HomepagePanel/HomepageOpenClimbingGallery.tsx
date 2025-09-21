import styled from '@emotion/styled';
import { convertHexToRgba } from '../utils/colorUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import Link from 'next/link';
import { intl, t } from '../../services/intl';
import React from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature, LonLat } from '../../services/types';

const HOMEPAGE_GALLERY_HEIGHT = 200;

type GalleryItemType = {
  href: string;
  src: string;
  label: string;
  center: LonLat;
};

const data: GalleryItemType[] = [
  {
    href: '/relation/17262675',
    src: '/images/homepage/hlubocepske-plotny',
    label: 'Hlubočepské plotny 🇨🇿',
    center: [14.3927293, 50.0441017],
  },
  {
    href: '/relation/17696060',
    src: '/images/homepage/frankenjura',
    label: 'Frankenjura 🇩🇪',
    center: [11.3682785, 49.7465462],
  },
  {
    href: '/relation/17470613',
    src: '/images/homepage/alkazar',
    label: 'Alkazar 🇨🇿',
    center: [14.1244611, 49.950313],
  },
  {
    href: '/relation/19250793',
    src: '/images/homepage/sokoliki',
    label: 'Sokoliki 🇵🇱',
    center: [15.8679484, 50.8674463],
  },
  {
    href: '/relation/14297763',
    src: '/images/homepage/velka',
    label: 'Velká (Vltavská žula) 🇨🇿',
    center: [14.2516807, 49.6666024],
  },
  {
    href: '/relation/18501782',
    src: '/images/homepage/geyikbayiri',
    label: 'Geyikbayırı 🇹🇷',
    center: [30.4868349, 36.8754952],
  },
  {
    href: '/relation/17130099',
    src: '/images/homepage/roviste',
    label: 'Roviště 🇨🇿',
    center: [14.2556371, 49.660973],
  },
  {
    href: '/relation/19257709',
    src: '/images/homepage/szklarska-poreba',
    label: 'Szklarska Poręba 🇵🇱',
    center: [15.5108783, 50.8266512],
  },
  {
    href: '/relation/18647139',
    src: '/images/homepage/san-bartolo',
    label: 'San Bartolo 🇪🇸',
    center: [-5.7209517, 36.0889594],
  },
  {
    href: '/relation/18452584',
    src: '/images/homepage/rochlitz',
    label: 'Rochlitz 🇩🇪',
    center: [12.7719492, 51.0273325],
  },
  {
    href: '/relation/18478296',
    src: '/images/homepage/timpa-rossa',
    label: 'Timpa Rossa 🇮🇹',
    center: [14.9483232, 36.8386582],
  },
  {
    href: '/relation/18218704',
    src: '/images/homepage/rastenfeld',
    label: 'Rastenfeld 🇦🇹',
    center: [15.3213433, 48.566838],
  },
  {
    href: '/relation/17142287',
    src: '/images/homepage/lomy-nad-velkou',
    label: 'Lomy nad Velkou 🇨🇿',
    center: [14.2511312, 49.652123],
  },
  {
    href: '/relation/17400318',
    src: '/images/homepage/kobyla',
    label: 'Kobyla 🇨🇿',
    center: [14.0806949, 49.9136053],
  },
  {
    href: '/relation/18286650',
    src: '/images/homepage/ratao',
    label: 'Ratão 🇵🇹',
    center: [-8.2314618, 41.0469073],
  },
  {
    href: '/relation/14297668',
    src: '/images/homepage/jickovice',
    label: 'Jickovice 🇨🇿',
    center: [14.1955833, 49.4537897],
  },
  {
    href: '/relation/17301396',
    src: '/images/homepage/tetinske-skaly',
    label: 'Tetínské skály 🇨🇿',
    center: [14.1077375, 49.9496788],
  },
  {
    href: '/relation/17416413',
    src: '/images/homepage/solvayovy-lomy',
    label: 'Solvayovy lomy 🇨🇿',
    center: [14.1446707, 49.9725761],
  },
  {
    href: '/relation/17399801',
    src: '/images/homepage/u-zidovy-strouhy',
    label: 'U Židovy strouhy 🇨🇿',
    center: [14.4631705, 49.2822267],
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
  margin: 40px -32px 0 -32px;
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

const Text = styled.h2<{ center?: boolean }>`
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

const GalleryItem = ({ item }: { item: GalleryItemType }) => {
  const { setPreview } = useFeatureContext();
  const onHover = () => setPreview({ center: item.center } as Feature); // TODO fix setPreview to accept only coordinates

  return (
    <GalleryItemContainer>
      <StyledLink href={item.href} locale={intl.lang} onMouseEnter={onHover}>
        <>
          <img
            src={`${item.src}.jpg`}
            srcSet={`${item.src}.jpg, ${item.src}-2.jpg 2x`}
            height={HOMEPAGE_GALLERY_HEIGHT}
            alt={`${t('homepage.openclimbing_climbing_area')} ${item.label}`}
            title={`${t('homepage.openclimbing_climbing_area')} ${item.label}`}
          />
          <Gradient>
            <Text>{item.label}</Text>
          </Gradient>
        </>
      </StyledLink>
    </GalleryItemContainer>
  );
};

const DiscoverMoreItem = () => (
  <GalleryItemContainer>
    <StyledLink href="/climbing-areas" locale={intl.lang}>
      <>
        <img
          src="/images/homepage/solvayovy-lomy.jpg"
          height={HOMEPAGE_GALLERY_HEIGHT}
          alt="illustration"
        />
        <Gradient blur>
          <Text center>
            <DiscoveryMoreText>
              {t('homepage.discover_more_p1')}
            </DiscoveryMoreText>
            700+ {t('homepage.discover_more_p2')}
          </Text>
        </Gradient>
      </>
    </StyledLink>
  </GalleryItemContainer>
);

export const HomepageOpenClimbingGallery = () => (
  <GalleryWrapper>
    <StyledScrollbars universal autoHide>
      {data.map((item) => (
        <GalleryItem key={item.href} item={item} />
      ))}
      <DiscoverMoreItem />
    </StyledScrollbars>
  </GalleryWrapper>
);
