import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path, PathSvg } from './Path';
import { Slider } from './Slider';
import { ImageTag } from '../../../services/types';
import { getOsmappLink } from '../../../services/helpers';
import { removeFilePrefix } from '../Climbing/utils/photo';

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
  const { feature } = useFeatureContext();

  if (!imageTag.imageUrl) {
    return null;
  }

  const onClick = () => {
    const isCrag = feature.tags.climbing === 'crag';
    if (isCrag) {
      const featureLink = getOsmappLink(feature);
      const photoLink = removeFilePrefix(imageTag.v);
      Router.push(`${featureLink}/climbing/${photoLink}`);
    }
  };

  return (
    <ImageWrapper onClick={onClick}>
      <img src={imageTag.imageUrl} height={270} alt={imageTag.v} />
      <PathSvg>
        {imageTag.paths.map(({ shortId, path }) => (
          <Path key={shortId} path={path} />
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
