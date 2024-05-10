import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getImageSize, ImageSize } from '../../../services/helpers';
import { Path } from './Path';
import { Slider } from './Slider';

const Svg = styled.svg`
  border-radius: 8px;
  height: 200px;
  width: auto;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const Image = ({ imageTag }: { imageTag: ImageTag }) => {
  const [imageSize, setImageSize] = useState<ImageSize>(null);

  useEffect(() => {
    if (imageTag.imageUrl) {
      getImageSize(imageTag.imageUrl).then((size) => {
        setImageSize(size);
      });
    } else {
      // TODO api calls
      setImageSize(null);
    }
  }, [imageTag]);

  if (!imageSize) {
    return null; // <div>Loading {imageTag.type}...</div>;
  }

  const { height, width } = imageSize;

  return (
    <div>
      <Svg viewBox={`0 0 ${width} ${height}`}>
        <image href={imageTag.imageUrl} width={width} height={height} />
        <Path points={imageTag.points} width={width} height={height} />
      </Svg>
    </div>
  );
};

export const ImagePane = () => {
  const {
    feature: { imageTags },
  } = useFeatureContext();
  // const mainImage = images[0]; // only this will be SSRed as /node/1234/image.jpg

  return (
    <div>
      <Slider>
        {imageTags.map((imageTag) => (
          <Image key={imageTag.k} imageTag={imageTag} />
        ))}
        {/* Fody */}
        {/* Mapillary */}
        {/* Upload new */}
      </Slider>
    </div>
  );
};
