import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import { publishDbgObject } from '../utils';

let mapIsIdle: (value: maplibregl.Map) => void;
export const mapIdlePromise = new Promise<maplibregl.Map>((resolve) => {
  mapIsIdle = resolve;
});

let map: maplibregl.Map | undefined = undefined;
export const setGlobalMap = (newMap: maplibregl.Map) => {
  map = newMap;
  map?.on('idle', () => mapIsIdle(newMap));
  publishDbgObject('map', map);
};
export const getGlobalMap = () => map;

export const getOverpassSource = () =>
  getGlobalMap()?.getSource('overpass') as GeoJSONSource | undefined;
