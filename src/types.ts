import { Feature as GeojsonFeature, Geometry } from 'geojson';
import { OsmType } from './services/types';

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

// below ONLY shared types among server + client

// shared types among climbingTiles server + client:

export type Tile = { z: number; x: number; y: number };

export type ClimbingStatsResponse = {
  lastRefresh: string;
  osmDataTimestamp: string;
  devStats: Record<string, string>;
  groupsCount: number;
  groupsWithNameCount: number;
  routesCount: number;
};

export type ClimbingTilesProperties =
  | { type: 'area'; label: string; routeCount: number; hasImages: boolean }
  | { type: 'crag'; label: string; routeCount: number; hasImages: boolean }
  | { type: 'gym'; label: string }
  | { type: 'ferrata'; label: string }
  | { type: 'route'; label: string; gradeId: number; color?: string }; // label contains name + original grade

export type ClimbingSearchRecord = {
  type: string;
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
