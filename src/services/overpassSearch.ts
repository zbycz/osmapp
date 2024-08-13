import { Feature, GeometryCollection, LineString, Point } from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';
import { OsmApiId } from './helpers';
import { fetchJson } from './fetch';

const getQueryFromTags = (tags) => {
  const selector = tags
    .map(([k, v]) => (v === '*' ? `["${k}"]` : `["${k}"="${v}"]`))
    .join('');
  return `nwr${selector}`;
};

const getOverpassQuery = ([a, b, c, d], query) =>
  `[out:json][timeout:25][bbox:${[d, a, b, c]}];(${query};);out geom qt;`;

export const getOverpassUrl = (fullQuery) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    fullQuery,
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

const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
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
      properties: { ...getPoiClass(tags), ...tags, osmappType: type },
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });

export const performOverpassSearch = async (
  bbox,
  tagsOrQuery: Record<string, string> | string,
) => {
  const body =
    typeof tagsOrQuery === 'string'
      ? tagsOrQuery
      : getQueryFromTags(Object.entries(tagsOrQuery));
  const query = getOverpassQuery(bbox, body);

  console.log('seaching overpass for query: ', query); // eslint-disable-line no-console
  const overpass = await fetchJson(getOverpassUrl(query));
  console.log('overpass result:', overpass); // eslint-disable-line no-console

  const features = overpassGeomToGeojson(overpass);
  console.log('overpass geojson', features); // eslint-disable-line no-console

  return { type: 'FeatureCollection', features };
};
