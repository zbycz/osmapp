import maplibregl, { GeoJSONSource } from 'maplibre-gl';

let map: maplibregl.Map;
export const setGlobalMap = (newMap: maplibregl.Map) => {
  map = newMap;
};
export const getGlobalMap = () => map;

export const getOverpassSource = () =>
  getGlobalMap().getSource('overpass') as GeoJSONSource | undefined;
