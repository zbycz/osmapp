import React, { useEffect, useState } from 'react';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';
import { Slider } from './Slider';
import {
  getInstantImage,
  ImageType2,
} from '../../../services/images/getImageDefs';
import { DotLoader } from '../../helpers';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { not } from '../../../utils';
import { Image } from './Image';

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
      {loading && (
        <div>
          <DotLoader />
        </div>
      )}
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
