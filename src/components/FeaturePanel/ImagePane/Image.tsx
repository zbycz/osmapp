import Router from 'next/router';
import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ImageDef, isTag } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getOsmappLink } from '../../../services/helpers';
import { removeFilePrefix } from '../Climbing/utils/photo';
import {
  getImageDefId,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { Paths } from './Paths';
import { Size } from './types';
import { InfoTooltip } from '../../utils/InfoTooltip';

const HEIGHT = 245;
const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

const Img = styled.img<{ $hasPaths: boolean }>`
  max-height: 300px;

  ${({ $hasPaths }) =>
    $hasPaths &&
    css`
      opacity: 0.9; // let the paths be more prominent
    `}
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

const useImgSizeOnload = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = React.useState<Size>(initialSize);

  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height });
  };

  // SSR case:
  useEffect(() => {
    if (imgRef.current?.complete) {
      setSize({ width: imgRef.current.width, height: imgRef.current.height });
    }
  }, []);

  return { imgRef, size, onPhotoLoad };
};

type Props = {
  def: ImageDef;
  image: ImageType2;
  onlyOneImage: boolean;
};

export const Image = ({ def, image, onlyOneImage }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();
  const onClick = useGetOnClick(def);

  const hasPaths = isTag(def) && (def.path?.length || def.memberPaths?.length);

  return (
    <ImageWrapper onClick={onClick}>
      <Img
        src={image.imageUrl}
        width={onlyOneImage ? '100%' : undefined}
        height={onlyOneImage ? undefined : HEIGHT}
        alt={getImageDefId(def)}
        onLoad={onPhotoLoad}
        $hasPaths={!!hasPaths}
        ref={imgRef}
      />
      {hasPaths && <Paths def={def} size={size} />}
      <InfoButton image={image} />
      {image.uncertainImage && <UncertainCover />}
    </ImageWrapper>
  );
};
