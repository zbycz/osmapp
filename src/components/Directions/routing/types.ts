import { NamedBbox } from '../../../services/getCenter';
import { Sign } from './instructions';

export type Profile = 'car' | 'bike' | 'walk';

export type RoutingResult = {
  /** minutes */
  time: number;
  /** meters */
  distance: number;
  /** meters */
  totalAscent: number;
  router: string;
  link: string;
  bbox: NamedBbox;
  geojson: GeoJSON.GeoJSON;
  instructions?: {
    distance: number;
    heading: number;
    interval: [number, number];
    sign: Sign;
    street_name: string;
    text: string;
    time: string;
  }[];
};

export class PointsTooFarError extends Error {
  constructor() {
    super('Points are too far from road network');
  }
}
