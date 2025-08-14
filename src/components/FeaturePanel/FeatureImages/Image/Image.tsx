import React from 'react';
import styled from '@emotion/styled';
import {
  getImageDefId,
  ImageType,
} from '../../../../services/images/getImageDefs';
import { PathsSvg } from '../PathsSvg';

import { HEIGHT } from '../helpers';
import {
  ImageClickHandler,
  initialSize,
  UncertainCover,
  useImgSizeOnload,
} from './helpers';
import { PanoramaImg } from './PanoramaImg';
import { InfoButton } from './InfoButton';
import { ImageDef, isTag } from '../../../../services/types';
import { isMobileMode } from '../../../helpers';
import { css } from '@emotion/react';
import { PANEL_GAP } from '../../../utils/PanelHelpers';

const Img = styled.img<{ $hasPaths: boolean }>`
  margin-left: 50%;
  transform: translateX(-50%);

  ${({ $hasPaths }) => $hasPaths && `opacity: 0.9;`}
`;

// example wide image: relation/1515375
const CROP_IMAGE_CSS = css`
  overflow: hidden;
  max-width: calc(410px - 2 * ${PANEL_GAP});
  @media ${isMobileMode} {
    max-width: calc(100% - 2 * ${PANEL_GAP});
  }

  &:has(+ div) {
    // if there is another image on the right, show 15px of it
    max-width: calc(410px - 2 * ${PANEL_GAP} - 15px);
    @media ${isMobileMode} {
      max-width: calc(100% - 2 * ${PANEL_GAP} - 15px);
    }
  }
`;

const ImageWrapper = styled.div<{ $hasPaths: boolean }>`
  display: inline-block;
  position: relative;
  height: 238px;
  vertical-align: top;
  overflow: hidden;

  margin-right: ${PANEL_GAP};
  &:first-of-type {
    margin-left: ${PANEL_GAP};
  }

  ${({ onClick }) => onClick && `cursor: pointer;`}
  ${({ $hasPaths }) => !$hasPaths && CROP_IMAGE_CSS}
`;

type Props = {
  def: ImageDef;
  image: ImageType;
  onClick: ImageClickHandler;
  alt?: string;
};

export const Image = ({ def, image, onClick, alt }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();

  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const isImageLoaded = size !== initialSize;
  const showInfo = image.panoramaUrl || isImageLoaded;
  return (
    <ImageWrapper $hasPaths={hasPaths} onClick={onClick}>
      {image.panoramaUrl ? (
        <PanoramaImg small={image.imageUrl} large={image.panoramaUrl} />
      ) : (
        <Img
          src={image.imageUrl}
          height={HEIGHT}
          alt={alt || getImageDefId(def)}
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
