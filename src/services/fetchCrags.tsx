import { fetchJson } from './fetch';
import { Feature, FeatureGeometry, LineString, Point } from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';
import { OsmApiId } from './helpers';
import { publishDbgObject } from '../utils';

// inspired by overpassSearch - but this computes all geometries (doesnt fetch them by 'geom' modifier)

const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

function getItems(elements) {
  const nodes = [];
  const ways = [];
  const relations = [];
  elements.forEach((element) => {
    if (element.type === 'node') {
      nodes.push(element);
    } else if (element.type === 'way') {
      ways.push(element);
    } else if (element.type === 'relation') {
      relations.push(element);
    }
  });
  return { nodes, ways, relations };
}

const convert = (
  element: any,
  geometryFn: (element: any) => FeatureGeometry,
): Feature => {
  const { type, id, tags = {} } = element;
  const geometry = geometryFn(element);
  const center = getCenter(geometry) ?? undefined;
  return {
    type: 'Feature',
    id: convertOsmIdToMapId({ type, id }),
    osmMeta: { type, id },
    tags,
    properties: { ...getPoiClass(tags), ...tags, osmappType: type },
    geometry,
    center,
  };
};

const getNodeGeomFn =
  () =>
  (node: any): Point => ({
    type: 'Point',
    coordinates: [node.lon, node.lat],
  });

const getWayGeomFn =
  (lookup) =>
  ({ nodes }): LineString => ({
    type: 'LineString' as const,
    coordinates: nodes
      .map((ref) => lookup.node[ref]?.geometry?.coordinates)
      .filter(Boolean), // some nodes may be missing
  });

function getRelationGeomFn(lookup) {
  return ({ id, center, members }): FeatureGeometry => {
    const geometries = members
      .map(({ type, ref }) => lookup[type][ref]?.geometry)
      .filter(Boolean); // some members may be undefined in first pass

    return geometries.length
      ? {
          type: 'GeometryCollection',
          geometries,
        }
      : center
      ? { type: 'Point', coordinates: [center.lon, center.lat] }
      : undefined;
  };
}

const addToLookup = (items: Feature[], lookup) => {
  items.forEach((item) => {
    lookup[item.osmMeta.type][item.osmMeta.id] = item;
  });
};

export const cragsToGeojson = (response: any): Feature[] => {
  const { nodes, ways, relations } = getItems(response.elements);

  const lookup = { node: {}, way: {}, relation: {} };

  const NODE_GEOM = getNodeGeomFn();
  const nodesOut = nodes.map((node) => convert(node, NODE_GEOM));
  addToLookup(nodesOut, lookup);

  const WAY_GEOM = getWayGeomFn(lookup);
  const waysOut = ways.map((way) => convert(way, WAY_GEOM));
  addToLookup(waysOut, lookup);

  // first pass
  const RELATION_GEOM1 = getRelationGeomFn(lookup);
  const relationsOut1 = relations.map((relation) =>
    convert(relation, RELATION_GEOM1),
  );
  addToLookup(relationsOut1, lookup);

  // second pass for climbing=area geometries
  // TODO: loop while number of geometries changes
  // TODO: update only geometries (?)
  const RELATION_GEOM2 = getRelationGeomFn(lookup);
  const relationsOut2 = relations.map((relation) =>
    convert(relation, RELATION_GEOM2),
  );

  return [...nodesOut, ...waysOut, ...relationsOut2];
};

// on CZ 48,11,51,19 makes 12 MB   (only crags is 700kB)
export const fetchCrags = async () => {
  const query = `[out:json][timeout:25];
    (
      nwr["climbing"](49.64474,14.21855,49.67273,14.28025);
      >;<;
      rel["climbing"="crag"](48,11,51,19);
    );
    (
      ._;
      rel(br);
    );
    out center qt;
  `;
  const data = encodeURIComponent(query);
  const url = `https://overpass-api.de/api/interpreter?data=${data}`;
  const overpass = await fetchJson(url);
  const features = cragsToGeojson(overpass);

  const relationPoints = features
    .filter((f) => f.osmMeta.type === 'relation' && f.center)
    .map((element) => ({
      ...element,
      geometry: {
        type: 'Point',
        coordinates: element.center,
      },
      properties: {
        ...element.properties,
        osmappType: 'relationPoint',
      },
    }));

  const featuresWithRelationPoints = [...features, ...relationPoints];
  publishDbgObject('fetchCrags', featuresWithRelationPoints);

  return {
    type: 'FeatureCollection',
    features: featuresWithRelationPoints,
  } as GeoJSON.FeatureCollection;
};
