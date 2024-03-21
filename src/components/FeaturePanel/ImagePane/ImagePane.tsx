import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getCommonsImageUrl } from '../../../services/images/getWikiImage';
import { getImageSize, ImageSize } from '../../../services/helpers';

const Svg = styled.svg`
  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;
const PathBorder = styled.path`
  stroke-width: 5;
  stroke: ${({ theme }) => theme.palette.climbing.border};
`;
const PathLine = styled.path`
  stroke-width: 4;
  stroke: ${({ theme }) => theme.palette.climbing.inactive};
`;
const Path = ({ points, width, height }) => {
  const d = points
    .map(({ x, y }, idx) => `${!idx ? 'M' : 'L'}${x * width} ${y * height}`)
    .join(',');

  return (
    <>
      <PathBorder d={d} />
      <PathLine d={d} />
    </>
  );
};

const parsePathString = (pathString?: string) =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      type: y.slice(-1), // TODO only letter
    }))
    .filter(({ x, y }) => !isNaN(x) && !isNaN(y)) ?? [];

type TagImage = {
  type: 'image' | 'wikimedia_commons';
  k: string;
  v: string;
  url: string;
  path: string;
  points: { x: number; y: number; type: string }[];
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

export const ImagePane = () => {
  const { feature } = useFeatureContext();
  const images = getTagImages(feature.tags); //TODO move to Feature

  const mainImage = images[0]; // only this will be SSRed

  const [imageSize, setImageSize] = useState<ImageSize>(null);

  useEffect(() => {
    getImageSize(mainImage.url).then((size) => {
      setImageSize(size);
    });
  }, [mainImage]);

  return (
    <div>
      {imageSize && (
        <Svg width={imageSize.width} height={imageSize.height}>
          <image
            href={mainImage.url}
            width={imageSize.width}
            height={imageSize.height}
          />
          <Path
            points={mainImage.points}
            width={imageSize.width}
            height={imageSize.height}
          />
        </Svg>
      )}
    </div>
  );
};
