import React from 'react';
import { ImageDef } from '../../../services/types';
import {
  getImageDefId,
  ImageType,
} from '../../../services/images/getImageDefs';
import styled from '@emotion/styled';
import { PanoramaImg } from './Image/PanoramaImg';

type GalleryProps = {
  def: ImageDef;
  images: ImageType[];
  isFirst: boolean;
};

const GalleryWrapper = styled.div`
  scroll-snap-align: center;
  width: 100%;
  height: 100%;
  flex: none;
  position: relative;
  overflow: hidden;
`;

const BgImg = ({ url }: { url: string }) => (
  <img
    src={url}
    style={{
      inset: '0px',
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      position: 'absolute',
      display: 'inline-block',
      filter: 'blur(4px)',
    }}
    loading="lazy"
  />
);

const MainImg = ({ url, alt }: { url: string; alt: string }) => (
  <img
    src={url}
    alt={alt}
    style={{
      objectFit: 'contain',
      position: 'absolute',
      inset: '0',
      height: '100%',
      width: '100%',
      display: 'inline-block',
    }}
    loading="lazy"
  />
);

type ImageProps = {
  image: ImageType;
  def: ImageDef;
  high: boolean;
  wide: boolean;
};

const Image: React.FC<ImageProps> = ({ image, def, high, wide }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      ...(high ? { gridRow: 'span 2' } : {}),
      ...(wide ? { gridColumn: 'span 2' } : {}),
    }}
  >
    <BgImg url={image.imageUrl} />
    <MainImg url={image.imageUrl} alt={getImageDefId(def)} />
  </div>
);

type SeeMoreProps = {
  image: ImageType;
};

const SeeMoreButton: React.FC<SeeMoreProps> = ({ image }) => (
  <button
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      border: 'none',
      padding: 0,
      background: 'transparent',
      cursor: 'pointer',
    }}
  >
    <BgImg url={image.imageUrl} />
    <span
      style={{
        position: 'relative',
        zIndex: 2,
        color: '#000',
        fontSize: '1rem',
        backgroundColor: 'rgba(212, 212, 216, 0.5)',
        padding: '0.125rem 0.25rem',
        borderRadius: '0.125rem',
      }}
    >
      See More
    </span>
  </button>
);

const GalleryInner: React.FC<GalleryProps> = ({ def, images }) => {
  const panorama = images.find(({ panoramaUrl }) => panoramaUrl);
  if (panorama) {
    return <PanoramaImg url={panorama.panoramaUrl} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
        height: '100%',
        width: '100%',
      }}
    >
      {images.slice(0, 4).map((image, i) => {
        const isLastImg = images.length - 1 === i;
        const isBlurredButton = !isLastImg && images.length > 4 && i === 3;

        if (isBlurredButton) {
          return <SeeMoreButton key={image.imageUrl} image={image} />;
        }

        return (
          <Image
            key={image.imageUrl}
            image={image}
            def={def}
            high={images.length <= 2 || (images.length === 3 && i === 1)}
            wide={images.length === 1}
          />
        );
      })}
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ def, images, isFirst }) => (
  <GalleryWrapper>
    <GalleryInner def={def} images={images} isFirst={isFirst} />
  </GalleryWrapper>
);
