import { getCommonsImageUrl } from './getWikiImage';
import {
  Feature,
  FeatureTags,
  ImageDef,
  ImageFromCenter,
  ImageFromTag,
  imageTagRegexp,
  isTag,
  LonLat,
  PathType,
} from '../types';

export type ImageType2 = {
  imageUrl: string;
  description: string;
  linkUrl: string;
  link: string;
  sameImageResolvedAlsoFrom?: ImageFromTag[];
  uncertainImage?: true;
};

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

export const getInstantImage = (k, v): ImageType2 | null => {
  if (k.match(/^(wikimedia_commons|image)/) && v.match(/^File:/)) {
    return {
      imageUrl: getCommonsImageUrl(v, 410),
      description: `Wikimedia Commons image (${k}=*)`,
      linkUrl: `https://commons.wikimedia.org/wiki/${v}`,
      link: v,
    };
  }

  if (k.startsWith('image')) {
    const url = v.match(/https?:/) ? v : `https://${v}`;
    return {
      imageUrl: url,
      description: `Image link (${k}=*)`,
      linkUrl: url,
      link: v,
    };
  }

  return null; // API call needed
};

const getImagesFromTags = (tags: FeatureTags) =>
  Object.keys(tags)
    .filter((k) => k.match(imageTagRegexp))
    .map((k) => {
      const v = tags[k];
      const instant = !!getInstantImage(k, v);
      const path = parsePathTag(tags[`${k}:path`]);
      return { type: 'tag', k, v, instant, path } as ImageFromTag;
    })
    .sort((a, b) => +b.instant - +a.instant);

const getImagesFromCenter = (tags: FeatureTags, center?: LonLat): ImageDef[] =>
  !center
    ? []
    : [
        ...(tags.information
          ? [{ type: 'center', service: 'fody', center } as ImageFromCenter]
          : []),
        { type: 'center', service: 'mapillary', center } as ImageFromCenter,
      ];

export const getImageDefs = (tags: FeatureTags, center?: LonLat) => [
  ...getImagesFromTags(tags),
  ...getImagesFromCenter(tags, center),
];

export const mergeMemberImageDefs = (
  feature: Feature,
  memberFeatures: Feature[],
) => {
  const destinationDefs = feature.imageDefs;
  if (!destinationDefs) {
    // eg. skeleton
    return;
  }

  memberFeatures.forEach((member) => {
    member.imageDefs?.forEach((memberDef) => {
      if (!(isTag(memberDef) && memberDef.path)) {
        return;
      }

      const { v, path } = memberDef;
      const equalValueAsMemberDef = (def) => def.v === v;
      const match = destinationDefs.find(equalValueAsMemberDef) as ImageFromTag;
      if (match) {
        match.memberPaths ??= [];
        match.memberPaths.push({ path, member });
      } else {
        destinationDefs.push({
          ...memberDef,
          memberPaths: [{ path, member }],
        } as ImageFromTag);
      }
    });
  });
};

export const getImageDefId = (def: ImageDef) =>
  isTag(def) ? `tag-${def.k}` : def.service;
