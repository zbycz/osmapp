import React from 'react';
import { Image } from './Image/Image';
import { useLoadImages } from './useLoadImages';
import { NoImage } from './NoImage';
import { ImageSkeleton } from './helpers';
import { getClickHandler } from './Image/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getHumanPoiType, getLabel } from '../../../helpers/featureLabel';
import { Wrapper } from '../Properties/Wrapper';
import { Slider } from './Image/Slider';

export const FeatureImages = () => {
  const { feature } = useFeatureContext();
  const imageDefs = feature?.imageDefs;
  const { loading, images } = useLoadImages(imageDefs);
  const poiType = getHumanPoiType(feature);
  const alt = `${poiType} ${getLabel(feature)}`;
  if (images.length === 0) {
    // CragsInArea condition
    if (feature.memberFeatures?.length && feature.tags.climbing === 'area') {
      return null;
    } else {
      return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
    }
  }

  return (
    <Wrapper>
      <Slider>
        {images.map((item, index) => (
          <Image
            key={item.image.imageUrl}
            def={item.def}
            image={item.image}
            onClick={getClickHandler(feature, item.def)}
            alt={`${alt} ${index + 1}`}
          />
        ))}
      </Slider>
    </Wrapper>
  );
};
