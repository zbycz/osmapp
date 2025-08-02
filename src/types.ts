import { Feature as GeojsonFeature, Geometry } from 'geojson';
import { OsmType } from './services/types';

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

// below ONLY shared types among server + client

export type Tile = { z: number; x: number; y: number };

export type ClimbingStatsResponse = {
  lastRefresh: string;
  osmDataTimestamp: string;
  devStats: Record<string, string>;
  groupsCount: number;
  groupsWithNameCount: number;
  routesCount: number;
};

export type ClimbingTilesProperties = {
  type: 'area' | 'crag' | 'route' | 'gym' | 'ferrata';
  label: string;
  // group only:
  routeCount?: number;
  hasImages?: boolean;
  histogramCode?: string;
  // route only:
  gradeId?: number;
  color?: string; // computed on FE
};

export type ClimbingSearchRecord = {
  type: ClimbingTilesProperties['type'];
  lon: number;
  lat: number;
  osmType: OsmType;
  osmId: number;
  name: string;
};

export type ClimbingTilesFeature = GeojsonFeature<
  Geometry,
  ClimbingTilesProperties
>;

export type ClimbingTick = {
  id: number;
  osmUserId: number;
  osmType: string | null;
  osmId: number | null;
  timestamp: string;
  style: string | null;
  myGrade: string | null;
  note: string | null;
  pairing: Record<string, string> | null;
};
