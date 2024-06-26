import { getCommonsImageUrl } from './getWikiImage';
import {
  Feature,
  FeatureTags,
  ImageTag,
  imageTagRegexp,
  PathType,
} from '../types';

const getSuffix = (y: string) => {
  const matches = y.match(/([^.0-9].*)$/);
  return matches ? matches[1] : '';
};

const parsePathTag = (pathString?: string): PathType | undefined => {
  const points = pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      suffix: getSuffix(y),
    }))
    .filter(({ x, y }) => !Number.isNaN(x) && !Number.isNaN(y));

  return points?.length ? points : undefined;
};

const getImageUrl = (type: ImageTag['type'], v: string): string | null => {
  if (type === 'image') {
    return v.match(/^File:/) ? getCommonsImageUrl(v, 400) : v;
  }

  if (type === 'wikimedia_commons') {
    return getCommonsImageUrl(v, 400);
  }

  return null; // API call needed
};

export const getImageTags = (tags: FeatureTags): ImageTag[] =>
  Object.keys(tags)
    .filter((k) => k.match(imageTagRegexp))
    .map((k) => {
      const type = k.match(imageTagRegexp)?.[1] as ImageTag['type']; // TODO wikipedia:xx
      const v = tags[k];
      const imageUrl = getImageUrl(type, v);
      const pathTag = tags[`${k}:path`];
      const path = parsePathTag(pathTag);
      return { type, k, v, imageUrl, pathTag, path };
    });

export const mergeMemberImageTags = (
  feature: Feature,
  memberFeatures: Feature[],
) => {
  const destination = feature.imageTags ?? []; // for skeleton (?)

  memberFeatures.forEach((member) => {
    member.imageTags
      ?.filter((imageTag) => imageTag.path)
      ?.forEach((imageTag) => {
        const { v, path } = imageTag;

        const match = destination.find((dest) => dest.v === v);
        if (match) {
          match.memberPaths ??= [];
          match.memberPaths.push({ path, member });
        } else {
          destination.push({
            ...imageTag,
            memberPaths: [{ path, member }],
          });
        }
      });
  });
};
