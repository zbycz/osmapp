import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';
import { Slider } from './Slider';
import {
  getInstantImage,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { not, publishDbgObject } from '../../../utils';
import { Image } from './Image';
import { InlineSpinner } from './InlineSpinner';

type ImagesType = { def: ImageDef; image: ImageType2 }[];

const mergeResultFn = (def: ImageDef, image: ImageType2) => (prevImages: ImagesType) => {
    if (image == null) {
      return [...prevImages, { def, image }];
    }

    const found = prevImages.find(
      (item) => item.image?.linkUrl === image.linkUrl,
    );
    if (found) {
      (found.image.sameImageResolvedAlsoFrom ??= []).push(image);
      return [...prevImages];
    }

    return [...prevImages, { def, image }];
  };
const useLoadImages = (defs: ImageDef[]) => {
  const instantDefs = defs?.filter(isInstant) ?? [];
  const apiDefs = defs?.filter(not(isInstant)) ?? [];

  const [loading, setLoading] = useState(apiDefs.length > 0);
  const [images, setImages] = useState<ImagesType>(
    instantDefs.map((def) => ({
      def,
      image: getInstantImage(def),
    })),
  );

  useEffect(() => {
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

const Wrapper = styled.div`
  position: relative;
  background: #ddd;
  height: 238px;
  min-height: 238px; /* otherwise it shrinks b/c of flex*/
`;

const IconWrapper = styled.div`
  padding-top: 40px;
  text-align: center;
  svg,
  img {
    width: 100px;
    height: 100px;
    color: #eee;
  }
  img {
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

export const ImageSlider = () => {
  const { feature } = useFeatureContext();
  const defs = feature.imageDefs;
  const { loading, images } = useLoadImages(defs);

  if (!defs?.length) {
    return null;
  }

  const onlyOneImage = defs.length === 1;

  const imagesNotNull = images.filter((item) => item.image != null);

  return (
    <Slider onlyOneImage={onlyOneImage}>
      <Wrapper>
        <Icon />
        {loading && <InlineSpinner />}
      </Wrapper>
      {imagesNotNull.map((item) => (
        <Image
          key={item.image.imageUrl}
          def={item.def}
          image={item.image}
          onlyOneImage={onlyOneImage}
        />
      ))}

      {/* Upload new */}
    </Slider>
  );
};
