import React from 'react';
import styled from 'styled-components';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path, PathSvg } from './Path';
import { Slider } from './Slider';
import { ImageTag } from '../../../services/types';

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;

  img,
  svg {
    border-radius: 8px;
  }

  svg {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
`;

const Image = ({ imageTag }: { imageTag: ImageTag }) => {
  if (!imageTag.imageUrl) {
    return null;
  }

  return (
    <ImageWrapper>
      <img src={imageTag.imageUrl} alt={imageTag.k} width={200} />
      <PathSvg>
        {imageTag.paths.map((path) => (
          <Path path={path} />
        ))}
      </PathSvg>
    </ImageWrapper>
  );
};

export const ImageSlider = () => {
  const {
    feature: { imageTags },
  } = useFeatureContext();

  // temporary - until ImageSlider is finished
  if (!imageTags?.some(({ points }) => points.length)) {
    return null;
  }

  return (
    <div>
      <Slider>
        {imageTags.map((imageTag) => (
          <Image key={imageTag.k} imageTag={imageTag} />
        ))}
        {/* Fody */}
        {/* Mapillary */}
        {/* Upload new */}
      </Slider>
    </div>
  );
};
