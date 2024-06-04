import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path, PathSvg } from './Path';
import { Slider } from './Slider';
import { Feature, ImageTag } from '../../../services/types';
import { getOsmappLink } from '../../../services/helpers';
import { sanitizeWikimediaCommonsPhotoName } from '../Climbing/utils/photo';

const ImageWrapper = styled.a`
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

const Image = ({
  imageTag,
  feature,
}: {
  imageTag: ImageTag;
  feature: Feature;
}) => {
  if (!imageTag.imageUrl) {
    return null;
  }

  const onPhotoClick = () => {
    const isCrag = feature.tags.climbing === 'crag';
    if (isCrag) {
      Router.push(
        `/${getOsmappLink(
          feature,
        )}/climbing/${sanitizeWikimediaCommonsPhotoName(imageTag.v)}`,
      );
    }
  };

  return (
    <ImageWrapper onClick={onPhotoClick}>
      <img src={imageTag.imageUrl} alt={imageTag.k} height={270} />
      <PathSvg>
        {imageTag.paths.map(({ path }) => (
          <Path path={path} />
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
    <div>
      <Slider>
        {feature.imageTags.map((imageTag) => (
          <Image key={imageTag.k} imageTag={imageTag} feature={feature} />
        ))}
        {/* Fody */}
        {/* Mapillary */}
        {/* Upload new */}
      </Slider>
    </div>
  );
};
