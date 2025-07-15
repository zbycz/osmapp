import { Feature } from 'geojson';
import { OsmType } from './services/types';

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
