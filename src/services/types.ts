import type Vocabulary from '../locales/vocabulary';
import type { getSchemaForFeature } from './tagging/idTaggingScheme';

export interface ImageUrls {
  source?: string;
  link: string;
  thumb: string;
  sharp?: string;
  username?: string;
  portrait?: boolean;
  timestamp?: string;
  isPano?: boolean;
}
export type LoadingImage = null;
export type NoImage = undefined;
export type Image = ImageUrls | LoadingImage | NoImage;

export const imageTagRegexp =
  /^(image|wikimedia_commons|wikidata|wikipedia)(\d*|:(?!path)[^:]+)$/;
export type PathType = { x: number; y: number; suffix: string }[];
export type MemberPath = {
  path: PathType;
  member: Feature;
};
export type ImageFromTag = {
  type: 'tag';
  k: string;
  v: string;
  instant: boolean; // true = no API call needed
  path?: PathType;
  memberPaths?: MemberPath[];
};
export type ImageFromCenter = {
  type: 'center';
  service: 'mapillary' | 'fody';
  center: LonLat;
};
export type ImageDef = ImageFromTag | ImageFromCenter;
export const isCenter = (def: ImageDef): def is ImageFromCenter =>
  def?.type === 'center';
export const isTag = (def: ImageDef): def is ImageFromTag =>
  def?.type === 'tag';
export const isInstant = (def: ImageDef): def is ImageFromTag =>
  isTag(def) && def.instant;

// coordinates in geojson format: [lon, lat] = [x,y]
export type LonLat = number[];
export type LonLatRounded = string[];
export type Position = LonLat; // TODO merge those two types
export type PositionBoth = LonLat | LonLatRounded;

export interface Point {
  type: 'Point';
  coordinates: Position;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
}

export interface GeometryCollection {
  type: 'GeometryCollection';
  geometries: Array<Point | LineString | GeometryCollection>;
}

export type FeatureGeometry = Point | LineString | GeometryCollection;

export const isPoint = (geometry: FeatureGeometry): geometry is Point =>
  geometry?.type === 'Point';
export const isLineString = (
  geometry: FeatureGeometry,
): geometry is LineString => geometry?.type === 'LineString';
export const isGeometryCollection = (
  geometry: FeatureGeometry,
): geometry is GeometryCollection => geometry?.type === 'GeometryCollection';

export interface FeatureTags {
  [key: string]: string;
}

interface RelationMember {
  ref: string;
  role: string;
  type: string;
}

// TODO split in two types /extend/
export interface Feature {
  point?: boolean; // TODO rename to isMarker or isCoords
  type: 'Feature';
  id?: number; // for map hover effect
  geometry?: FeatureGeometry;
  osmMeta: {
    type: string;
    id: string;
    visible?: string;
    version?: string;
    changeset?: string;
    timestamp?: string;
    user?: string;
    uid?: string;
    lat?: string;
    lon?: string;
    role?: string; // only for memberFeatures
  };
  tags: FeatureTags;
  members?: RelationMember[];
  memberFeatures?: Feature[];
  parentFeatures?: Feature[];
  imageDefs?: ImageDef[];
  properties: {
    class: string;
    subclass: string;
    [key: string]: string | number | boolean;
    osmappRouteCount?: number;
    osmappHasImages?: boolean;
    osmappType?: 'node' | 'way' | 'relation';
    osmappLabel?: string;
  };
  center: Position;
  countryCode?: string; // ISO3166-1 code, undefined = no country
  roundedCenter?: LonLatRounded;
  ssrFeatureImage?: Image;
  error?: 'network' | 'unknown' | '404' | '500'; // etc.
  deleted?: boolean;
  schema?: ReturnType<typeof getSchemaForFeature>; // undefined means error

  // skeleton
  layer?: { id: string };
  source?: string;
  sourceLayer?: string;
  state?: { hover: boolean };
  skeleton?: boolean; // that means loading is in progress
  nonOsmObject?: boolean;
}

export type MessagesType = typeof Vocabulary;
export type TranslationId = keyof MessagesType;

export type SuccessInfo = {
  type: 'note' | 'edit';
  text: string;
  url: string;
  redirect?: string;
};
