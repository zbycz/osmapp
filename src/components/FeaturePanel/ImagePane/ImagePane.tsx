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

  return (
    <div>
      {imageSize && (
        <Svg width={imageSize.width} height={imageSize.height}>
          <image
            href={imageTag.imageUrl}
            width={imageSize.width}
            height={imageSize.height}
          />
          <Path
            points={imageTag.points}
            width={imageSize.width}
            height={imageSize.height}
          />
        </Svg>
      )}
      {!imageSize && <div>Loading {imageTag.type}...</div>}
    </div>
  );
};

export const ImagePane = () => {
  const { feature } = useFeatureContext();
  const imageTags = getImageTags(feature.tags); //TODO move to osmToFeature()
  // const mainImage = images[0]; // only this will be SSRed

  return (
    <div>
      {imageTags.map((imageTag, i) => (
        <Image key={i} imageTag={imageTag} />
      ))}
      {/*Fody*/}
      {/*Mapillary*/}
      {/*Upload new*/}
    </div>
  );
};
