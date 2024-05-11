import React from 'react';
import styled from 'styled-components';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Path } from './Path';
import { Slider } from './Slider';
import { ImageTag } from '../../../services/types';

const Svg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 8px;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const Image = ({ imageTag }: { imageTag: ImageTag }) => {
  // const [imageSize, setImageSize] = useState<ImageSize>(null);
  //
  // useEffect(() => {
  //   if (imageTag.imageUrl) {
  //     getImageSize(imageTag.imageUrl).then((size) => {
  //       setImageSize(size);
  //     });
  //   } else {
  //     // TODO api calls
  //     setImageSize(null);
  //   }
  // }, [imageTag]);
  //
  // if (!imageSize) {
  //   return null; // <div>Loading {imageTag.type}...</div>;
  // }

  if (!imageTag.imageUrl) {
    return null; // <div>Loading {imageTag.type}...</div>;
  }

  const width = 100;
  const height = 100;

  return (
    <div>
      <img src={imageTag.imageUrl} alt="x" />

      <Svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
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
