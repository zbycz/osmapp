import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getCommonsImageUrl } from '../../../services/images/getWikiImage';
import { getImageSize, ImageSize } from '../../../services/helpers';
import { Path } from './Path';
import { Slider } from './Slider';

const Svg = styled.svg`
  border-radius: 8px;
  height: 130px;
  width: auto;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const getSuffix = (y: string) => {
  const matches = y.match(/([^.0-9].*)$/);
  return matches ? matches[1] : '';
};

const parsePathString = (pathString?: string) =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      suffix: getSuffix(y),
    }))
    .filter(({ x, y }) => !isNaN(x) && !isNaN(y)) ?? [];

type ImageTag = {
  type: 'image' | 'wikimedia_commons' | 'wikidata' | 'wikipedia' | 'website';
  k: string;
  v: string;
  imageUrl: string | null; // null = API call needed
  path: string;
  points: { x: number; y: number; suffix: string }[];
};

const imageRegexp =
  /^(image|wikimedia_commons|wikidata|wikipedia|wikipedia:[a-z+]|website)(:?\d*)$/;

const getImageUrl = (type: TagImage['type'], v: string): string | null => {
  if (type === 'image') {
    return v.match(/^File:/) ? getCommonsImageUrl(v, 200) : v;
  }

  if (type === 'wikimedia_commons') {
    return getCommonsImageUrl(v, 200);
  }

  return null; // API call needed
};

const getImageTags = (tags: FeatureTags): ImageTag[] => {
  return Object.keys(tags)
    .filter((k) => k.match(imageRegexp))
    .map((k) => {
      const type = k.match(imageRegexp)?.[1] as ImageTag['type'];
      const v = tags[k];
      const imageUrl = getImageUrl(type, v);
      const path = tags[`${k}:path`];
      const points = parsePathString(path);
      return { type, k, v, imageUrl, path, points };
    });
};

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
    return null; //<div>Loading {imageTag.type}...</div>;
  }

  const { height, width } = imageSize;

  return (
    <div>
      {/*<Svg width={width} height={height}>*/}
      <Svg viewBox={`0 0 ${width} ${height}`}>
        <image href={imageTag.imageUrl} width={width} height={height} />
        <Path points={imageTag.points} width={width} height={height} />
      </Svg>
    </div>
  );
};

export const ImagePane = () => {
  const { feature } = useFeatureContext();
  const imageTags = getImageTags(feature.tags); //TODO move to osmToFeature()
  // const mainImage = images[0]; // only this will be SSRed as /node/1234/image.jpg

  return (
    <div>
      <Slider>
        {imageTags.map((imageTag, i) => (
          <Image key={i} imageTag={imageTag} />
        ))}
        {/*Fody*/}
        {/*Mapillary*/}
        {/*Upload new*/}
      </Slider>
    </div>
  );
};
