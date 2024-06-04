import { getCommonsImageUrl } from './getWikiImage';
import { Feature, FeatureTags, ImageTag, imageTagRegexp } from '../types';

const getSuffix = (y: string) => {
  const matches = y.match(/([^.0-9].*)$/);
  return matches ? matches[1] : '';
};

const parsePathTag = (pathString?: string) =>
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
    return v.match(/^File:/) ? getCommonsImageUrl(v, 400) : v;
  }

  if (type === 'wikimedia_commons') {
    return getCommonsImageUrl(v, 400);
  }

  return null; // API call needed
};

const getPaths = (pathTag: string, shortId: string) => {
  const path = parsePathTag(pathTag);
  return path.length ? [{ path, shortId }] : [];
};

export const getImageTags = (tags: FeatureTags, shortId: string): ImageTag[] =>
  Object.keys(tags)
    .filter((k) => k.match(imageTagRegexp))
    .map((k) => {
      const type = k.match(imageTagRegexp)?.[1] as ImageTag['type']; // TODO wikipedia:xx
      const v = tags[k];
      const imageUrl = getImageUrl(type, v);
      const pathTag = tags[`${k}:path`];
      const paths = getPaths(pathTag, shortId);
      return { type, k, v, imageUrl, pathTag, paths };
    });

export const mergeMemberImages = (
  feature: Feature,
  memberFeatures: Feature[],
) => {
  memberFeatures
    .map((member) => member.imageTags)
    .flat()
    .forEach((imageTag) => {
      const match = feature.imageTags.find((tag) => tag.v === imageTag.v);
      if (match) {
        match.paths.push(...imageTag.paths);
      } else {
        feature.imageTags.push(imageTag);
      }
    });
};
