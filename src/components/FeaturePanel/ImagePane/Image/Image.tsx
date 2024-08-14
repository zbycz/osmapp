import React from 'react';
import styled from '@emotion/styled';
import {
  getImageDefId,
  ImageType,
} from '../../../../services/images/getImageDefs';
import { PathsSvg } from '../PathsSvg';

import { HEIGHT } from '../helpers';
import {
  initialSize,
  UncertainCover,
  useGetOnClick,
  useImgSizeOnload,
} from './helpers';
import { PanoramaImg } from './PanoramaImg';
import { InfoButton } from './InfoButton';
import { ImageDef, isTag } from '../../../../services/types';
import { isDesktop, isMobileMode } from '../../../helpers';
import { css } from '@emotion/react';

const Img = styled.img<{ $hasPaths: boolean }>`
  ${({ $hasPaths }) => $hasPaths && `opacity: 0.9;`}

  margin-left: 50%;
  transform: translateX(-50%);
`;

const ImageWrapper = styled.div<{ $hasPaths: boolean }>`
  display: inline-block;
  position: relative;
  height: 238px;
  vertical-align: top;

  margin-right: 8px;
  &:first-child {
    margin-left: 8px;
  }

  ${({ onClick }) => onClick && `cursor: pointer;`}

  ${({ $hasPaths }) =>
    !$hasPaths &&
    css`
      overflow: hidden;
      max-width: calc(410px - 2 * 8px);
      @media ${isMobileMode} {
        max-width: calc(100% - 2 * 8px);
      }
    `}
`;

type Props = {
  def: ImageDef;
  image: ImageType;
};

export const Image = ({ def, image }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();
  const onClick = useGetOnClick(def);
  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const isImageLoaded = size !== initialSize;
  const showInfo = image.panoramaUrl || isImageLoaded;
  return (
    <ImageWrapper $hasPaths={hasPaths} onClick={onClick}>
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
      {hasPaths && <PathsSvg def={def} size={size} />}
      {showInfo && <InfoButton image={image} />}
      {image.uncertainImage && !image.panoramaUrl && <UncertainCover />}
    </ImageWrapper>
  );
};
