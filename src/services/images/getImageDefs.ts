import {
  Feature,
  FeatureTags,
  ImageDef,
  ImageDefFromCenter,
  ImageDefFromTag,
  imageTagRegexp,
  isTag,
  LonLat,
  PathType,
} from '../types';
import { getCommonsImageUrl } from './getCommonsImageUrl';

export const WIDTH = 410;

export type ImageType = {
  imageUrl: string;
  description: string;
  linkUrl: string;
  link: string;
  uncertainImage?: true;
  sameUrlResolvedAlsoFrom?: ImageType[]; // only 1 level
  panoramaUrl?: string; // only for Mapillary (ImageDefFromCenter)
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

type KeyValue = { k: string; v: string };
export const getInstantImage = ({ k, v }: KeyValue): ImageType | null => {
  if (k.match(/^(wikimedia_commons|image)/) && v.match(/^File:/)) {
    return {
      imageUrl: decodeURI(getCommonsImageUrl(v, WIDTH)),
      description: `Wikimedia Commons image (${k}=*)`,
      linkUrl: `https://commons.wikimedia.org/wiki/${v}`,
      link: v,
    };
  }

  if (k.startsWith('image')) {
    const imageUrl = v.match(/https?:/) ? v : `https://${v}`;
    return {
      imageUrl,
      description: `Image link (${k}=*)`,
      linkUrl: imageUrl,
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
      const instant = !!getInstantImage({ k, v });
      const path = parsePathTag(tags[`${k}:path`]);
      return { type: 'tag', k, v, instant, path } as ImageDefFromTag;
    })
    .sort((a, b) => +b.instant - +a.instant);

const getImagesFromCenter = (tags: FeatureTags, center?: LonLat): ImageDef[] =>
  !center
    ? []
    : [
        ...(tags.information
          ? [{ type: 'center', service: 'fody', center } as ImageDefFromCenter]
          : []),
        { type: 'center', service: 'mapillary', center } as ImageDefFromCenter,
      ];

export const getImageDefs = (tags: FeatureTags, center?: LonLat) => [
  ...getImagesFromTags(tags),
  ...getImagesFromCenter(tags, center),
];

export const mergeMemberImageDefs = (feature: Feature) => {
  const destinationDefs = feature.imageDefs;
  if (!destinationDefs) {
    return; // eg. skeleton
  }

  feature.memberFeatures?.forEach((member) => {
    member.imageDefs?.forEach((memberDef) => {
      if (!(isTag(memberDef) && memberDef.path)) {
        return;
      }

      const { v, path } = memberDef;
      const equalValueAsMemberDef = (def) => def.v === v;
      const match = destinationDefs.find(
        equalValueAsMemberDef,
      ) as ImageDefFromTag;
      if (match) {
        match.memberPaths ??= [];
        match.memberPaths.push({ path, member });
      } else {
        destinationDefs.push({
          ...memberDef,
          memberPaths: [{ path, member }],
        } as ImageDefFromTag);
      }
    });
  });
};

export const getImageDefId = (def: ImageDef) =>
  isTag(def) ? `tag-${def.k}` : def.service;
