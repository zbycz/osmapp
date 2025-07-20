import { Feature } from 'geojson';
import { OsmType } from './services/types';

// ONLY shared types among server + client (climbingTiles, climbingTicks, ...)

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type Tile = { z: number; x: number; y: number };

export type ClimbingStatsResponse = {
  lastRefresh: string;
  osmDataTimestamp: string;
  devStats: Record<string, string>;
  groupsCount: number;
  groupsWithNameCount: number;
  routesCount: number;
};

export type ClimbingSearchRecord = {
  type: string;
  lon: number;
  lat: number;
  osmType: OsmType;
  osmId: number;
  name: string;
};

export type CTFeature = Feature;

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
