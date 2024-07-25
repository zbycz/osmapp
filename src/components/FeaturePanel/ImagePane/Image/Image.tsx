import React from 'react';
import styled from 'styled-components';
import { ImageDef, isTag } from '../../../../services/types';
import {
  getImageDefId,
  ImageType2,
} from '../../../../services/images/getImageDefs';
import { Paths } from '../Paths';

import { HEIGHT } from '../helpers';
import {
  initialSize,
  UncertainCover,
  useGetOnClick,
  useImgSizeOnload,
} from './helpers';
import { PanoramaImg } from './PanoramaImg';
import { InfoButton } from './InfoButton';

const Img = styled.img<{ $hasPaths: boolean }>`
  ${({ $hasPaths }) => $hasPaths && `opacity: 0.9;`}
`;

const ImageWrapper = styled.div`
  display: inline-block;
  position: relative;
  height: 238px;

  margin-right: 8px;
  &:first-child {
    margin-left: 8px;
  }

  ${({ onClick }) => onClick && `cursor: pointer;`}
`;

type Props = {
  def: ImageDef;
  image: ImageType2;
};

export const Image = ({ def, image }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();
  const onClick = useGetOnClick(def);
  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const isImageLoaded = size !== initialSize;
  const showInfo = image.panoramaUrl || isImageLoaded;
  return (
    <ImageWrapper onClick={onClick}>
      {image.panoramaUrl ? (
        <PanoramaImg url={image.panoramaUrl} />
      ) : (
        <Img
          src={image.imageUrl}
          height={HEIGHT}
          alt={getImageDefId(def)}
          onLoad={onPhotoLoad}
          $hasPaths={hasPaths}
          ref={imgRef}
        />
      )}
      {hasPaths && <Paths def={def} size={size} />}
      {showInfo && <InfoButton image={image} />}
      {image.uncertainImage && !image.panoramaUrl && <UncertainCover />}
    </ImageWrapper>
  );
};
