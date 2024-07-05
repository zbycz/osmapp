import React from 'react';
import styled, { css } from 'styled-components';
import Router from 'next/router';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path, PathSvg } from './Path';
import { ImageTag } from '../../../services/types';
import { getKey, getOsmappLink } from '../../../services/helpers';
import { removeFilePrefix } from '../Climbing/utils/photo';
import { Size } from './types';
import { Slider } from './Slider';

const HEIGHT = 245;
const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

const Img = styled.img<{ $onlyOneImage: boolean }>`
  max-height: 300px;

  &.hasPaths {
    opacity: 0.9; // let the paths be more prominent
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}

  svg {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

const Image = ({
  imageTag,
  onlyOneImage,
}: {
  imageTag: ImageTag;
  onlyOneImage: boolean;
}) => {
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

  const hasPaths = imageTag.path?.length || imageTag.memberPaths?.length;
  return (
    <ImageWrapper onClick={onClick}>
      <Img
        src={imageTag.imageUrl}
        width={onlyOneImage ? '100%' : undefined}
        height={onlyOneImage ? undefined : HEIGHT}
        $onlyOneImage={onlyOneImage}
        alt={imageTag.v}
        onLoad={onPhotoLoad}
        className={hasPaths ? 'hasPaths' : ''}
      />
      <PathSvg size={size}>
        {imageTag.path && (
          <Path path={imageTag.path} feature={feature} size={size} />
        )}
        {imageTag.memberPaths?.map(({ path, member }) => (
          <Path key={getKey(member)} path={path} feature={member} size={size} />
        ))}
      </PathSvg>
    </ImageWrapper>
  );
};

export const ImageSlider = () => {
  const { feature } = useFeatureContext();

  const onlyOneImage =
    (feature.imageTags?.filter((imageTag) => imageTag.imageUrl) ?? [])
      .length === 1;

  return (
    <Slider onlyOneImage={onlyOneImage}>
      {feature.imageTags.map((imageTag) => (
        <Image
          key={imageTag.k}
          imageTag={imageTag}
          onlyOneImage={onlyOneImage}
        />
      ))}
      {/* Fody */}
      {/* Mapillary */}
      {/* Upload new */}
    </Slider>
  );
};
