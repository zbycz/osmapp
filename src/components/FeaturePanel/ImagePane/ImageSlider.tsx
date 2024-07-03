import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Router from 'next/router';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Paths } from './Paths';
import { ImageDef, isInstant, isTag } from '../../../services/types';
import { getOsmappLink } from '../../../services/helpers';
import { removeFilePrefix } from '../Climbing/utils/photo';
import { Size } from './types';
import { Slider } from './Slider';
import {
  getImageDefId,
  getInstantImage,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { DotLoader } from '../../helpers';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { InfoTooltip } from '../../utils/InfoTooltip';

const HEIGHT = 245;
const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

const Img = styled.img`
  max-height: 300px;

  &.hasPaths {
    opacity: 0.9; // let the paths be more prominent
  }
`;

const UncertainCover = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: contrast(0.6) brightness(1.2);
  box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.3);
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  //box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

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

const useGetOnClick = (def: ImageDef) => {
  const { feature } = useFeatureContext();

  if (isTag(def) && feature.tags.climbing === 'crag') {
    return () => {
      const featureLink = getOsmappLink(feature);
      const photoLink = removeFilePrefix(def.v);
      Router.push(`${featureLink}/climbing/${photoLink}`);
    };
  }

  return undefined;
};

const InfoButtonWrapper = styled.div`
  position: absolute;
  right: 5px;
  bottom: 0;
  z-index: 1;
  svg {
    color: #fff;
  }
`;

const InfoButton = ({ image }: { image: ImageType2 }) => (
  <InfoButtonWrapper>
    <InfoTooltip
      tooltip={
        <>
          {image.description}
          <br />
          <a href={image.linkUrl} target="_blank">
            {image.link}
          </a>
        </>
      }
    />
  </InfoButtonWrapper>
);

const Image = ({
  def,
  onlyOneImage,
}: {
  def: ImageDef;
  onlyOneImage: boolean;
}) => {
  const [size, setSize] = useState<Size>(initialSize);
  const onClick = useGetOnClick(def);
  const [image, setImage] = useState<ImageType2 | 'loading' | null>(
    isInstant(def) ? getInstantImage(def.k, def.v) : 'loading',
  );
  useEffect(() => {
    if (!isInstant(def)) {
      getImageFromApi(def).then(setImage);
    }
  }, []);
  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height });
  };

  if (!image) {
    return null;
  }

  if (image === 'loading') {
    return (
      <div>
        <DotLoader />
      </div>
    );
  }

  const hasPaths = isTag(def) && (def.path?.length || def.memberPaths?.length);

  return (
    <ImageWrapper onClick={onClick}>
      <Img
        src={image.imageUrl}
        width={onlyOneImage ? '100%' : undefined}
        height={onlyOneImage ? undefined : HEIGHT}
        alt={getImageDefId(def)}
        onLoad={onPhotoLoad}
        className={hasPaths ? 'hasPaths' : ''}
      />
      {hasPaths && <Paths def={def} size={size} />}
      <InfoButton image={image} />
      {image.uncertainImage && <UncertainCover />}
    </ImageWrapper>
  );
};

export const ImageSlider = () => {
  const { feature } = useFeatureContext();

  if (!feature.imageDefs?.length) {
    return null;
  }

  const onlyOneImage = feature.imageDefs.length === 1;

  return (
    <Slider onlyOneImage={onlyOneImage}>
      {feature.imageDefs.map((def) => (
        <Image key={getImageDefId(def)} def={def} onlyOneImage={onlyOneImage} />
      ))}
      {/* Upload new */}
    </Slider>
  );
};
