import { getCommonsImageUrl } from './getWikiImage';
import { FeatureTags, ImageTag, imageTagRegexp } from '../types';

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
    .filter(({ x, y }) => !Number.isNaN(x) && !Number.isNaN(y)) ?? [];

const getImageUrl = (type: ImageTag['type'], v: string): string | null => {
  if (type === 'image') {
    return v.match(/^File:/) ? getCommonsImageUrl(v, 200) : v;
  }

  if (type === 'wikimedia_commons') {
    return getCommonsImageUrl(v, 200);
  }

  return null; // API call needed
};

export const getImageTags = (tags: FeatureTags): ImageTag[] =>
  Object.keys(tags)
    .filter((k) => k.match(imageTagRegexp))
    .map((k) => {
      const type = k.match(imageTagRegexp)?.[1] as ImageTag['type'];
      const v = tags[k];
      const imageUrl = getImageUrl(type, v);
      const path = tags[`${k}:path`];
      const points = parsePathString(path);
      return { type, k, v, imageUrl, path, points };
    });
