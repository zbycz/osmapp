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

const getLookup = (elements): Record<string, FeatureGeometry> =>
  elements.reduce(
    (acc, { geometry, osmMeta }) => ({
      ...acc,
      [osmMeta.id]: geometry,
    }),
    {},
  );

const getNodeGeomFn =
  () =>
  (node: any): Point => ({
    type: 'Point',
    coordinates: [node.lon, node.lat],
  });

const getWayGeomFn =
  (nodesLookup) =>
  ({ nodes }): LineString => ({
    type: 'LineString' as const,
    coordinates: nodes
      .map((ref) => nodesLookup[ref]?.coordinates)
      .filter(Boolean), // some nodes may be missing
  });

function getRelationGeomFn(waysLookup, nodesLookup, relationsLookup) {
  return ({ id, center, members }): FeatureGeometry => {
    const geometries = members
      .map(({ type, ref }) => {
        if (type === 'way') {
          return waysLookup[ref];
        }
        if (type === 'node') {
          return nodesLookup[ref];
        }
        if (type === 'relation') {
          return relationsLookup[ref]; // this can be undefined in first pass, hence filter
        }

        throw new Error(`Unknown member type: ${type} in relation: ${id}`);
      })
      .filter(Boolean);

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

export const cragsToGeojson = (response: any): Feature[] => {
  const { elements } = response;
  const { nodes, ways, relations } = getItems(elements);

  const NODE_GEOM = getNodeGeomFn();
  const nodesOut = nodes.map((node) => convert(node, NODE_GEOM));
  const nodesLookup = getLookup(nodesOut);

  const WAY_GEOM = getWayGeomFn(nodesLookup);
  const waysOut = ways.map((way) => convert(way, WAY_GEOM));
  const waysLookup = getLookup(waysOut);

  const RELATION_GEOM1 = getRelationGeomFn(waysLookup, nodesLookup, {});
  const relationsOut1 = relations.map((relation) =>
    convert(relation, RELATION_GEOM1),
  );
  const relationsLookup = getLookup(relationsOut1);

  // we need second pass for climbing=area  (TODO: loop while number of geometries changes)
  const RELATION_GEOM2 = getRelationGeomFn(
    waysLookup,
    nodesLookup,
    relationsLookup,
  );
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
