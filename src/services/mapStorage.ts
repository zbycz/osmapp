import maplibregl from 'maplibre-gl';

let map: maplibregl.Map;
export const setGlobalMap = (newMap: maplibregl.Map) => {
  map = newMap;
};
export const getGlobalMap = () => map;
