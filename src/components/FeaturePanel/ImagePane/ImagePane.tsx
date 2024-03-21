import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getCommonsImageUrl } from '../../../services/images/getWikiImage';
import { getImageSize, ImageSize } from '../../../services/helpers';
import { Path } from './Path';

const Svg = styled.svg`
  border-radius: 4px;

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

type TagImage = {
  type: 'image' | 'wikimedia_commons';
  k: string;
  v: string;
  url: string;
  path: string;
  points: { x: number; y: number; suffix: string }[];
};

const imageRegexp = /^(image|wikimedia_commons)(:?\d*)$/;

const getImageUrl = (type: TagImage['type'], v: string): string | null => {
  if (type === 'image') {
    return v.match(/^File:/) ? getCommonsImageUrl(v, 200) : v;
  }

  if (type === 'wikimedia_commons') {
    return getCommonsImageUrl(v, 200);
  }

  return null;
};

const getTagImages = (tags: FeatureTags): TagImage[] => {
  return Object.keys(tags)
    .filter((k) => k.match(imageRegexp))
    .map((k) => {
      const type = k.match(imageRegexp)?.[1] as TagImage['type'];
      const v = tags[k];
      const url = getImageUrl(type, v);
      const path = tags[`${k}:path`];
      const points = parsePathString(path);
      return { type, k, v, url, path, points };
    });
};

const Image = ({ image }: { image: TagImage }) => {
  const [imageSize, setImageSize] = useState<ImageSize>(null);

  useEffect(() => {
    getImageSize(image.url).then((size) => {
      setImageSize(size);
    });
  }, [image]);

  return (
    <div>
      {imageSize && (
        <Svg width={imageSize.width} height={imageSize.height}>
          <image
            href={image.url}
            width={imageSize.width}
            height={imageSize.height}
          />
          <Path
            points={image.points}
            width={imageSize.width}
            height={imageSize.height}
          />
        </Svg>
      )}
    </div>
  );
};

export const ImagePane = () => {
  const { feature } = useFeatureContext();
  const images = getTagImages(feature.tags); //TODO move to Feature

  const mainImage = images[0]; // only this will be SSRed

  return (
    <div>
      {images.map((image, i) => (
        <Image key={i} image={image} />
      ))}
    </div>
  );
};
