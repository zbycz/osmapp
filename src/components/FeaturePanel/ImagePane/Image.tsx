import Router from 'next/router';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
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
import { TooltipButton } from '../../utils/TooltipButton';
import { encodeUrl } from '../../../helpers/utils';

export const HEIGHT = 238;
const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

const Img = styled.img<{ $hasPaths: boolean }>`
  ${({ $hasPaths }) => $hasPaths && `opacity: 0.9;`}
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
  display: inline-block;
  position: relative;
  height: 238px;

  margin-right: 8px;
  &:first-child {
    margin-left: 8px;
  }

  ${({ onClick }) => onClick && `cursor: pointer;`}
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

const PanoramaImg = ({ url }: { url: string }) => {
  const configUrl = `${window.location.protocol}//${window.location.host}/pannellum-config.json`;
  const pannellumUrl = encodeUrl`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${url}&config=${configUrl}`;

  return (
    <iframe
      title="panorama"
      allowFullScreen
      style={{
        borderStyle: 'none',
        width: '100%',
        height: '100%',
      }}
      src={pannellumUrl}
    />
  );
};

const TooltipContent = ({ image }: { image: ImageType2 }) => (
  <>
    {image.description}
    <br />
    <a href={image.linkUrl} target="_blank">
      {image.link}
    </a>
  </>
);

const InfoButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  svg {
    color: #fff;
    filter: drop-shadow(0 0 2px #000);
    font-size: 15px;
  }
`;

const InfoButton = ({ image }: { image: ImageType2 }) => (
  <InfoButtonWrapper>
    <TooltipButton
      tooltip={
        <>
          <TooltipContent image={image} />
          {image.sameImageResolvedAlsoFrom?.map((item) => (
            <Box key={item.imageUrl} mt={1}>
              <TooltipContent image={item} />
            </Box>
          ))}
        </>
      }
    />
  </InfoButtonWrapper>
);

const useImgSizeOnload = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = React.useState<Size>(initialSize);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setSize({ width: imgRef.current.width, height: imgRef.current.height }); // SSR case
    }
  }, []);

  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height }); // browser case
  };

  return { imgRef, size, onPhotoLoad };
};

type Props = {
  def: ImageDef;
  image: ImageType2;
};

export const Image = ({ def, image }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();
  const onClick = useGetOnClick(def);

  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const showInfo = size !== initialSize || image.panoramaUrl;
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
