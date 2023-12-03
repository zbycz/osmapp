import { Feature, GeometryCollection, LineString, Point } from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';
import { OsmApiId } from './helpers';
import { fetchJson } from './fetch';

const overpassQuery = (bbox, tags) => {
  const query = tags
    .map(([k, v]) => (v === '*' ? `["${k}"]` : `["${k}"="${v}"]`))
    .join('');

  return `[out:json][timeout:25];
  (
    node${query}(${bbox});
    way${query}(${bbox});
    relation${query}(${bbox});
  );
  out geom qt;`; // "out geom;>;out geom qt;" to get all full subitems as well
};

const getOverpassUrl = ([a, b, c, d], tags) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    overpassQuery([d, a, b, c], tags),
  )}`;

const GEOMETRY = {
  node: ({ lat, lon }): Point => ({ type: 'Point', coordinates: [lon, lat] }),

  way: ({ geometry }): LineString => ({
    type: 'LineString',
    coordinates: geometry.map(({ lat, lon }) => [lon, lat]),
  }),

  relation: ({ members }): GeometryCollection => ({
    type: 'GeometryCollection',
    geometries:
      members
        ?.map((el) =>
          el.type === 'node'
            ? GEOMETRY.node(el)
            : el.type === 'way'
            ? GEOMETRY.way(el)
            : null,
        )
        .filter(Boolean) ?? [],
  }),
};

// maybe take inspiration from https://github.com/tyrasd/osmtogeojson/blob/gh-pages/index.js

export const overpassGeomToGeojson = (response: any): Feature[] =>
  response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = GEOMETRY[type]?.(element);
    return {
      type: 'Feature',
      id: convertOsmIdToMapId({ type, id }),
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), ...tags },
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });

const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

export const performOverpassSearch = async (
  bbox,
  tags: Record<string, string>,
) => {
  console.log('seaching overpass for tags: ', tags); // eslint-disable-line no-console
  const overpass = await fetchJson(getOverpassUrl(bbox, Object.entries(tags)));
  console.log('overpass result:', overpass); // eslint-disable-line no-console

  const features = overpassGeomToGeojson(overpass);
  console.log('overpass geojson', features); // eslint-disable-line no-console

  return { type: 'FeatureCollection', features };
};
