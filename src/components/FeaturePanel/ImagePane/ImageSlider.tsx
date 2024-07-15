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
import { not } from '../../../utils';
import { Image } from './Image';
import { InlineSpinner } from './InlineSpinner';

type ImagesType = { def: ImageDef; image: ImageType2 }[];

const useLoadImages = (defs: ImageDef[]) => {
  const instants = defs?.filter(isInstant) ?? [];
  const rest = defs?.filter(not(isInstant)) ?? [];

  const [loading, setLoading] = useState(rest.length > 0);
  const [images, setImages] = useState<ImagesType>(
    instants.map((def) => ({
      def,
      image: getInstantImage(def),
    })),
  );

  useEffect(() => {
    const promises = defs.filter(not(isInstant)).map(async (def) => {
      const image = await getImageFromApi(def);
      setImages((prev) => [...prev, { def, image }]);
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [defs]);

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

  return (
    <Slider onlyOneImage={onlyOneImage}>
      <Wrapper>
        <Icon />
        {loading && <InlineSpinner />}
      </Wrapper>
      {images.map((image) =>
        image.image ? (
          <Image
            key={JSON.stringify(image)}
            def={image.def}
            image={image.image}
            onlyOneImage={onlyOneImage}
          />
        ) : null,
      )}

      {/* Upload new */}
    </Slider>
  );
};
