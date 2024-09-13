import React from 'react';
import { ImageDef } from '../../../services/types';
import {
  getImageDefId,
  ImageType,
} from '../../../services/images/getImageDefs';
import styled from '@emotion/styled';
import { Image } from './Image/Image';
import { PanoramaImg } from './Image/PanoramaImg';
import { ImageList, ImageListItem } from '@mui/material';

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
          // TODO: styling and implementation
          return <button key={i}>+</button>;
        }

        return (
          <div
            key={i}
            style={{
              height: '100%',
              width: '100%',
              backgroundImage: `url(${image.imageUrl})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              ...(images.length <= 2 ? { gridRow: 'span 2' } : {}),
              ...(images.length === 1 ? { gridColumn: 'span 2' } : {}),
            }}
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
