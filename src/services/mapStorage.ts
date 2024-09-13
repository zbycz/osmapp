import maplibregl, { GeoJSONSource } from 'maplibre-gl';

let resolveCallback;
export const loadedMapPromise = new Promise<maplibregl.Map>((resolve) => {
  resolveCallback = resolve;
});

let map: maplibregl.Map;
export const setGlobalMap = (newMap: maplibregl.Map) => {
  map = newMap;

  map?.on('idle', () => {
    resolveCallback(newMap);
  });
};
export const getGlobalMap = () => map;

export const getOverpassSource = () =>
  getGlobalMap().getSource('overpass') as GeoJSONSource | undefined;
