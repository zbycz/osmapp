import {
  Feature,
  FeatureTags,
  ImageDef,
  ImageDefFromCenter,
  ImageDefFromTag,
  isTag,
  LonLat,
  OsmType,
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
  panoramaUrl?: string; // only for street side photography (ImageDefFromCenter)
  provider?: string;
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
  if (
    k.startsWith('image') &&
    v.startsWith('https://commons.wikimedia.org/wiki/File')
  ) {
    return {
      imageUrl: getCommonsImageUrl(
        v.replace(
          /^https:\/\/commons.wikimedia.org\/wiki\/File(:|%3A|%3a)/,
          'File:',
        ),
        WIDTH,
      ),
      description: `Wikimedia Commons image (${k}=*)`,
      linkUrl: v,
      link: v,
    };
  }

  if (k.match(/^(wikimedia_commons|image)/) && v.startsWith('File:')) {
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

  if (k.startsWith('panoramax')) {
    const imageUrl = `https://api.panoramax.xyz/api/pictures/${v}/hd.jpg`;
    const linkUrl = `https://panoramax.xyz/#focus=pic&pic=${v}`;

    return {
      imageUrl,
      linkUrl,
      description: `Panoramax (${k}=*)`,
      link: 'Panoramax',
    };
  }

  return null; // API call needed
};

const naturalKeySorter = ([a]: string[], [b]: string[]) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const wikipedia = ([k, _]) => k.match(/^wikipedia(\d*|:.*)$/);
const wikidata = ([k, _]) => k.match(/^wikidata(\d*|:.*)$/);
const image = ([k, v]) =>
  k.match(/^image(\d*|:(?!path).*)$/) && v.match(/^File:|^https?:/);

const commons = (k: string) => k.match(/^wikimedia_commons(\d*|:(?!path).*)$/);
const commonsFile = ([k, v]) => commons(k) && v.startsWith('File:'); // TODO sometimes full url to the file may be present, but lets not support it for now
const commonsCategory = ([k, v]) => commons(k) && v.startsWith('Category:');

const mapillary = ([k, v]) => k === 'mapillary' && v.match(/^\d+$/);
const panoramax = ([k, _]) => k === 'panoramax';
const website = ([k, _]) => k === 'website' || k === 'contact:website';

const getImagesFromTags = (tags: FeatureTags) => {
  const entries = Object.entries(tags);
  const imageTags = [
    ...entries.filter(commonsFile).sort(naturalKeySorter),
    ...entries.filter(image),
    ...entries.filter(wikipedia),
    ...entries.filter(wikidata),
    ...entries.filter(commonsCategory),
    ...entries.filter(mapillary),
    ...entries.filter(panoramax),
    ...entries.filter(website),
  ];

  return imageTags
    .map(([k, v]) => {
      const instant = !!getInstantImage({ k, v });
      const path = parsePathTag(tags[`${k}:path`]);
      return { type: 'tag', k, v, instant, path } as ImageDefFromTag;
    })
    .sort((a, b) => +b.instant - +a.instant);
};

export const getImagesFromCenter = (
  tags: FeatureTags,
  osmType: OsmType,
  center?: LonLat,
): ImageDef[] => {
  if (!center || osmType === 'relation') {
    return [];
  }
  return [
    ...(tags.information
      ? [{ type: 'center', service: 'fody', center } as ImageDefFromCenter]
      : []),
    { type: 'center', service: 'panoramax', center } as ImageDefFromCenter,
    { type: 'center', service: 'kartaview', center } as ImageDefFromCenter,
    // it is annoying to scroll past a pano image - so we put it last
    { type: 'center', service: 'mapillary', center } as ImageDefFromCenter,
  ];
};

export const getImageDefs = (
  tags: FeatureTags,
  osmType: OsmType,
  center?: LonLat,
) => [
  ...getImagesFromTags(tags),
  ...getImagesFromCenter(tags, osmType, center),
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
      const equalValueAsMemberDef = (def: any) => def.v === v;
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
