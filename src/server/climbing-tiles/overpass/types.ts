import {
  FeatureGeometry,
  FeatureTags,
  GeometryCollection,
  LineString,
  OsmId,
  Point,
} from '../../../services/types';

type OsmType = 'node' | 'way' | 'relation';
export type OsmNode = {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

export type OsmWay = {
  type: 'way';
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
};

export type OsmRelation = {
  type: 'relation';
  id: number;
  members?: {
    type: OsmType;
    ref: number;
    role: string;
  }[];
  tags?: Record<string, string>;
  center?: { lat: number; lon: number }; // only for overpass `out center` queries
};

export type OsmItem = OsmNode | OsmWay | OsmRelation;
export type OsmResponse = {
  elements: OsmItem[];
  osm3s: { timestamp_osm_base: string }; // overpass only
};

export type GeojsonFeature<T extends FeatureGeometry = FeatureGeometry> = {
  type: 'Feature';
  id: number;
  osmMeta: OsmId;
  tags: FeatureTags;
  properties: {
    routeCount?: number;
    hasImages?: boolean;
    histogram?: number[]; // indexed by GRADE_TABLE.uiaa
    parentId?: number;
  };
  geometry: T;
  center?: number[];
  members?: OsmRelation['members'];
};

export type Lookup = {
  node: Record<number, GeojsonFeature<Point>>;
  way: Record<number, GeojsonFeature<LineString>>;
  relation: Record<number, GeojsonFeature<GeometryCollection>>;
};
