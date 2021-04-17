export interface ImageUrls {
  source?: string;
  link: string;
  thumb: string;
  username?: string;
  portrait?: boolean;
  timestamp?: string;
}

export type LoadingImage = null;
export type NoImage = undefined;

export type Image = ImageUrls | LoadingImage | NoImage;

// coordinates in geojson format: [x, y] = [lon, lat]
export type Position = number[]; // [number, number]

export interface Point {
  type: 'Point';
  coordinates: Position;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
}

export type FeatureGeometry = Point | LineString;

export const isPoint = (geometry: FeatureGeometry): geometry is Point =>
  geometry.type === 'Point';
export const isWay = (geometry: FeatureGeometry): geometry is LineString =>
  geometry.type === 'LineString';

export interface FeatureTags {
  [key: string]: string;
}

export interface Feature {
  type: 'Feature';
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
  };
  tags: FeatureTags;
  properties: {
    class: string;
    subclass: string;
  };
  center: Position;
  ssrFeatureImage?: Image;
  error?: 'gone';

  // skeleton
  layer?: { id: string };
  source?: string;
  sourceLayer?: string;
  state?: { hover: boolean };
  skeleton?: boolean;
  nonOsmObject?: boolean;
}
