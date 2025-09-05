import {
  FeatureGeometry,
  LineString,
  OsmId,
  Point,
} from '../../../services/types';
import { getCenter } from '../../../services/getCenter';
import { getHistogram, sumMemberHistograms } from './histogram';
import {
  GeojsonFeature,
  Lookup,
  OsmItem,
  OsmNode,
  OsmRelation,
  OsmResponse,
  OsmWay,
} from './types';

const convertOsmIdToMapId = (apiId: OsmId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

const getItems = (elements: OsmItem[], log: (message: string) => void) => {
  const nodes: OsmNode[] = [];
  const ways: OsmWay[] = [];
  const relations: OsmRelation[] = [];
  elements.forEach((element) => {
    if (element.type === 'node') {
      nodes.push(element);
    } else if (element.type === 'way') {
      ways.push(element);
    } else if (element.type === 'relation') {
      if (element.members) {
        relations.push(element);
      } else {
        log(`Skipping relation without members: relation/${element.id}`);
      }
    }
  });
  return { nodes, ways, relations };
};

const getRouteNumberFromTags = (element: OsmItem) => {
  const sport = parseFloat(element.tags['climbing:sport'] ?? '0');
  const trad = parseFloat(element.tags['climbing:trad'] ?? '0');
  const ice = parseFloat(element.tags['climbing:ice'] ?? '0');
  const multipitch = parseFloat(element.tags['climbing:multipitch'] ?? '0');
  const sum = sport + trad + ice + multipitch;

  return Number.isNaN(sum) ? 1 : sum; // can be eg. "yes" .. eg. relation/15056469
};

const getRouteCount = <T extends OsmItem>(element: T) => {
  if (element.tags?.climbing === 'crag') {
    return Math.max(
      element.type === 'relation'
        ? element.members.filter((member) => member.role === '').length // TODO filter by member element having climbing=route/route_bottom
        : 0,
      getRouteNumberFromTags(element),
    );
  }
  return undefined;
};

const convert = <T extends OsmItem, TGeometry extends FeatureGeometry>(
  element: T,
  geometryFn: (element: T) => TGeometry,
  lookup: Lookup,
): GeojsonFeature<TGeometry> => {
  const { type, id, tags = {} } = element;
  const geometry = geometryFn(element);
  const center = getCenter(geometry) ?? undefined;
  const histogram = getHistogram(element, lookup);

  const properties: GeojsonFeature['properties'] = {
    routeCount: getRouteCount(element),
    hasImages: Object.keys(tags).some((key) =>
      key.startsWith('wikimedia_commons'),
    ),
    histogram,
  };

  return {
    type: 'Feature',
    id: convertOsmIdToMapId({ type, id }),
    osmMeta: { type, id },
    tags,
    properties,
    geometry,
    center,
    members: element.type === 'relation' ? element.members : undefined,
  };
};

const getNodeGeomFn =
  () =>
  (node: any): Point => ({
    type: 'Point',
    coordinates: [node.lon, node.lat],
  });

const getWayGeomFn =
  (lookup: Lookup) =>
  ({ nodes }: OsmWay): LineString => ({
    type: 'LineString' as const,
    coordinates: nodes
      .map((ref) => lookup.node[ref]?.geometry?.coordinates)
      .filter(Boolean), // some nodes may be missing
  });

const getRelationGeomFn =
  (lookup: Lookup) =>
  ({ members, center }: OsmRelation): FeatureGeometry => {
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

const addToLookup = <T extends FeatureGeometry>(
  items: GeojsonFeature<T>[],
  lookup: Lookup,
) => {
  items.forEach((item) => {
    // @ts-ignore
    lookup[item.osmMeta.type][item.osmMeta.id] = item; // eslint-disable-line no-param-reassign
  });
};

const getRelationsWithAreaCount = (
  relations: GeojsonFeature[],
  lookup: Record<string, Record<string, GeojsonFeature>>,
): GeojsonFeature[] =>
  relations.map((relation) => {
    if (relation.tags?.climbing === 'area') {
      const members = relation.members.map(
        ({ type, ref }) => lookup[type][ref]?.properties,
      );
      const routeCount = members
        .map((member) => member?.routeCount ?? 1)
        .reduce((acc, count) => acc + count);
      const hasImages = members.some((member) => member?.hasImages);

      const histogram = sumMemberHistograms(members);

      return {
        ...relation,
        properties: {
          ...relation.properties,
          routeCount,
          hasImages,
          histogram,
        },
      };
    }

    return relation;
  });

const addParentIds = (lookup: Lookup) => {
  for (const relation of Object.values(lookup.relation)) {
    if (relation.tags?.climbing === 'area') {
      for (const member of relation.members ?? []) {
        const child = lookup[member.type][member.ref]; // we know, that in lookup is the same object as in nodesOut/waysOut
        if (child) {
          child.properties.parentId = relation.osmMeta.id;
        }
      }
    }
  }
};

export const overpassToGeojsons = (
  response: OsmResponse,
  log: (message: string) => void,
) => {
  const { nodes, ways, relations } = getItems(response.elements, log);

  const lookup = { node: {}, way: {}, relation: {} } as Lookup;

  const NODE_GEOM = getNodeGeomFn();
  const nodesOut = nodes.map((node) => convert(node, NODE_GEOM, lookup));
  addToLookup(nodesOut, lookup);

  const WAY_GEOM = getWayGeomFn(lookup);
  const waysOut = ways.map((way) => convert(way, WAY_GEOM, lookup));
  addToLookup(waysOut, lookup);

  // first pass
  const RELATION_GEOM1 = getRelationGeomFn(lookup);
  const relationsOut1 = relations.map((relation) =>
    convert(relation, RELATION_GEOM1, lookup),
  );
  addToLookup(relationsOut1, lookup);

  // second pass for climbing=area geometries
  // TODO: loop while number of geometries changes
  // TODO: update only geometries (?)
  const RELATION_GEOM2 = getRelationGeomFn(lookup);
  const relationsOut2 = relations.map((relation) =>
    convert(relation, RELATION_GEOM2, lookup),
  );
  lookup.relation = {};
  addToLookup(relationsOut2, lookup);

  const relationsOut3 = getRelationsWithAreaCount(relationsOut2, lookup);
  lookup.relation = {};
  addToLookup(relationsOut3, lookup);

  addParentIds(lookup);

  return {
    node: Object.values(lookup.node),
    way: Object.values(lookup.way),
    relation: Object.values(lookup.relation),
  };
};
