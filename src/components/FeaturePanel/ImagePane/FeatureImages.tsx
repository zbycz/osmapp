import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { grey } from '@mui/material/colors';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isCenter, isInstant } from '../../../services/types';
import {
  getInstantImage,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { not, publishDbgObject } from '../../../utils';
import { HEIGHT, Image } from './Image';

type ImagesType = { def: ImageDef; image: ImageType2 }[];

const mergeResultFn =
  (def: ImageDef, image: ImageType2) => (prevImages: ImagesType) => {
    if (image == null) {
      return prevImages;
    }

    const found = prevImages.find(
      (item) => item.image?.imageUrl === image.imageUrl,
    );
    if (found) {
      (found.image.sameImageResolvedAlsoFrom ??= []).push(image);
      return [...prevImages];
    }

    if (!isCenter(def)) {
      // leave center images in the end
      const centerIndex = prevImages.findIndex((item) => isCenter(item.def));
      if (centerIndex >= 0) {
        return [
          ...prevImages.slice(0, centerIndex),
          { def, image },
          ...prevImages.slice(centerIndex),
        ];
      }
    }

    return [...prevImages, { def, image }];
  };

const useLoadImages = (defs: ImageDef[]) => {
  const instantDefs = defs?.filter(isInstant) ?? [];
  const apiDefs = defs?.filter(not(isInstant)) ?? [];

  const initialState = instantDefs.map((def) => ({
    def,
    image: getInstantImage(def),
  }));
  const [loading, setLoading] = useState(apiDefs.length > 0);
  const [images, setImages] = useState<ImagesType>(initialState);

  useEffect(() => {
    setImages(initialState);
    const promises = apiDefs.map(async (def) => {
      const image = await getImageFromApi(def);
      setImages(mergeResultFn(def, image));
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [defs]);

  publishDbgObject('last images', images);
  return { loading, images };
};

const GrayImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${HEIGHT}px;
  background: ${({ theme }) =>
    theme.palette.mode === 'dark' ? grey['700'] : grey['100']};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
    color: #eee;
    opacity: 0.15;
  }
`;

const Icon = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const ico = properties.class;
  return (
    <IconWrapper>
      <img src={`/icons/${ico}_11.svg`} alt={ico} title={ico} />
    </IconWrapper>
  );
};

const SizeWrapper = styled.div`
  width: 100%;
  height: calc(${HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(${HEIGHT}px + 10px); // otherwise it shrinks b/c of flex
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  text-align: center; // one image centering

  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;
const Slider = ({ children }) => (
  <StyledScrollbars universal autoHide>
    {children}
  </StyledScrollbars>
);

const ImageSkeleton = styled.div`
  width: 200px;
  height: ${HEIGHT}px;
  margin: 0 auto;
  animation: skeleton-loading 1s linear infinite alternate;

  @keyframes skeleton-loading {
    0% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0,0%,40%)' : 'hsl(0, 0%, 95%)'};
    }
    100% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0, 0%,32%)' : 'hsl(0, 0%, 87%)'};
    }
  }
`;

export const FeatureImages = () => {
  const { feature } = useFeatureContext();
  const { loading, images } = useLoadImages(feature.imageDefs);
  const imagesNotNull = images.filter((item) => item.image != null);

  if (imagesNotNull.length === 0) {
    return (
      <SizeWrapper>
        {loading ? (
          <ImageSkeleton />
        ) : (
          <GrayImageWrapper>
            <Icon />
          </GrayImageWrapper>
        )}
      </SizeWrapper>
    );
  }

  return (
    <SizeWrapper>
      <Slider>
        {imagesNotNull.map((item) => (
          <Image key={item.image.imageUrl} def={item.def} image={item.image} />
        ))}
      </Slider>
    </SizeWrapper>
  );
};
