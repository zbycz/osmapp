import React from 'react';
import { useCurrentItem } from '../context/EditContext';
import { useLoadImages } from '../../FeatureImages/useLoadImages';
import { ImageSkeleton } from '../../FeatureImages/helpers';
import { NoImage } from '../../FeatureImages/NoImage';
import { Image } from '../../FeatureImages/Image/Image';
import { Slider, Wrapper } from '../../FeatureImages/Image/Slider';
import { getImageDefs } from '../../../../services/images/getImageDefs';
import { getApiId } from '../../../../services/helpers';
import { getGlobalMap } from '../../../../services/mapStorage';

import { AddNewImage } from './FeatureEditSection/ImagesEditor/AddNewImage';

export const Gallery = ({ imageDefs }) => {
  const { loading, images } = useLoadImages(imageDefs);

  if (images.length === 0) {
    return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
  }

  return (
    <Wrapper>
      <Slider>
        {images.map((item) => (
          <Image
            key={item.image.imageUrl}
            def={item.def}
            image={item.image}
            onClick={() => {}}
            alt={`${item.image.description}`}
          />
        ))}
        <AddNewImage />
      </Slider>
    </Wrapper>
  );
};
const getMapCenter = () => getGlobalMap().getCenter().toArray();
export const ImagesEditor = () => {
  const { tags, shortId } = useCurrentItem();
  const osmType = getApiId(shortId).type;
  const imageDefs = getImageDefs(tags, osmType, getMapCenter());

  return <Gallery imageDefs={imageDefs} />;
};
