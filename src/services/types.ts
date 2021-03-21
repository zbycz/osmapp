export type Position = number[]; // [number, number]
export interface Point {
  type: 'Point';
  coordinates: Position;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
}

export interface Feature {
  type: 'Feature';
  geometry: Point | LineString;
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
  tags: {
    [key: string]: string;
  };
  properties: {
    class: string;
    subclass: string;
  };
  center: Position;
  ssrFeatureImage?: string;

  // skeleton
  layer?: { id: string };
  source?: string;
  sourceLayer?: string;
  state?: { hover: boolean };
  skeleton?: boolean;
  nonOsmObject?: boolean;
  loading?: true;
}

// images

export interface ImageUrls {
  source: string;
  username: string;
  link: string;
  thumb: string;
}

export type LoadingImage = null;
export type NoImage = undefined;

export type Image = ImageUrls | LoadingImage | NoImage;
