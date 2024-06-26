import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path, PathSvg } from './Path';
import { Slider } from './Slider';
import { ImageTag } from '../../../services/types';
import { getKey, getOsmappLink } from '../../../services/helpers';
import { removeFilePrefix } from '../Climbing/utils/photo';
import { Size } from './types';

const HEIGHT = 270;
const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  ${({ onClick }) => onClick && 'cursor: pointer;&:hover{opacity: 0.8;}'}

  img,
  svg {
    border-radius: 8px;
  }

  img.hasPaths {
    opacity: 0.9; // let the paths be more prominent
  }

  svg {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
`;

const Image = ({ imageTag }: { imageTag: ImageTag }) => {
  const [size, setSize] = React.useState<Size>(initialSize);
  const { feature } = useFeatureContext();
  const isCrag = feature.tags.climbing === 'crag';

  if (!imageTag.imageUrl) {
    return null;
  }

  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height });
  };

  const onClick = isCrag
    ? () => {
        const featureLink = getOsmappLink(feature);
        const photoLink = removeFilePrefix(imageTag.v);
        Router.push(`${featureLink}/climbing/${photoLink}`);
      }
    : undefined;

  return (
    <ImageWrapper onClick={onClick}>
      <img
        src={imageTag.imageUrl}
        height={HEIGHT}
        alt={imageTag.v}
        onLoad={onPhotoLoad}
        className={imageTag.paths.length ? 'hasPaths' : ''}
      />
      <PathSvg size={size}>
        {imageTag.paths.map((imagePath) => (
          <Path
            key={getKey(imagePath.member)}
            imagePath={imagePath}
            size={size}
          />
        ))}
      </PathSvg>
    </ImageWrapper>
  );
};

export const ImageSlider = () => {
  const { feature } = useFeatureContext();

  // temporary - until ImageSlider is finished
  if (!feature.imageTags?.some(({ paths }) => paths.length)) {
    return null;
  }

  return (
    <Slider>
      {feature.imageTags.map((imageTag) => (
        <Image key={imageTag.k} imageTag={imageTag} />
      ))}
      {/* Fody */}
      {/* Mapillary */}
      {/* Upload new */}
    </Slider>
  );
};
