import { FeatureGeometry, OsmId } from '../../../services/types';
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
import { getUrlOsmId } from '../../../services/helpers';

const convertOsmIdToMapId = (apiId: OsmId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

const getItems = (elements: OsmItem[], log: (message: string) => void) => {
  const nodes: OsmNode[] = [];
  const ways: OsmWay[] = [];
  const relations: OsmRelation[] = [];
  for (const element of elements) {
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
  }
  return { nodes, ways, relations };
};

const safeParseFloat = (value: string | undefined): number => {
  const num = parseFloat(value ?? '0');
  return Number.isNaN(num) ? 0 : num;
};

const getRouteNumberFromTags = ({ tags }: OsmItem) => {
  const sum =
    safeParseFloat(tags['climbing:sport']) +
    safeParseFloat(tags['climbing:trad']) +
    safeParseFloat(tags['climbing:ice']) +
    safeParseFloat(tags['climbing:multipitch']);

  return sum > 0 ? sum : 1; // default 1 for crag with unknown count (needed for proper z-index in map)
};

const isRoute = (member: GeojsonFeature) =>
  ['route', 'route_bottom'].includes(member.tags.climbing);

const hasOwnImages = (element: OsmItem) =>
  Object.keys(element.tags ?? {}).some((key) =>
    key.startsWith('wikimedia_commons'),
  );

const hasMemberImages = (member: GeojsonFeature) =>
  member?.properties.hasImages;

const getCommonFields = (
  element: OsmItem,
  geometry: FeatureGeometry,
): GeojsonFeature => {
  const { type, id, tags = {} } = element;
  const center = getCenter(geometry) ?? undefined;

  return {
    type: 'Feature',
    id: convertOsmIdToMapId({ type, id }),
    osmMeta: { type, id },
    tags,
    geometry,
    center,
    members: element.type === 'relation' ? element.members : undefined,
    properties: {},
  };
};

const getNodeWayProperties = (element: OsmNode | OsmWay) => {
  const { tags = {} } = element;

  if (
    tags.climbing === 'crag' ||
    tags.climbing === 'area' ||
    tags.natural === 'cliff' ||
    tags.natural === 'peak'
  ) {
    return {
      hasImages: hasOwnImages(element),
      routeCount: getRouteNumberFromTags(element),
    };
  }

  return {
    hasImages: hasOwnImages(element),
  };
};

const convertNode = (node: OsmNode): GeojsonFeature => {
  const geometry = {
    type: 'Point' as const,
    coordinates: [node.lon, node.lat],
  };

  return {
    ...getCommonFields(node, geometry),
    properties: getNodeWayProperties(node),
  };
};

const convertWay = (way: OsmWay, lookup: Lookup): GeojsonFeature => {
  const geometry = {
    type: 'LineString' as const,
    coordinates: way.nodes
      .map((ref) => lookup.node[ref]?.geometry?.coordinates)
      .filter(Boolean),
  };

  return {
    ...getCommonFields(way, geometry),
    properties: getNodeWayProperties(way),
  };
};

const getRelationProperties = (
  relation: OsmRelation,
  members: GeojsonFeature[],
) => {
  const { tags = {} } = relation;

  if (tags.climbing === 'crag') {
    return {
      hasImages: hasOwnImages(relation) || members.some(hasMemberImages),
      histogram: getHistogram(members),
      routeCount: Math.max(
        members.filter(isRoute).length,
        getRouteNumberFromTags(relation),
      ),
    };
  }

  if (tags.climbing === 'area') {
    return {
      hasImages: hasOwnImages(relation) || members.some(hasMemberImages),
      histogram: sumMemberHistograms(members),
      routeCount: members
        .map((member) => member?.properties.routeCount ?? 1)
        .reduce((acc, count) => acc + count, 0),
    };
  }

  return {};
};

const lookupRelationMembers = (element: OsmItem, lookup: Lookup) =>
  element.type === 'relation'
    ? element.members.map(({ type, ref }) => lookup[type][ref]).filter(Boolean) // some members may be undefined in first pass
    : [];

const convertRelation = (
  relation: OsmRelation,
  lookup: Lookup,
): GeojsonFeature => {
  const members = lookupRelationMembers(relation, lookup); // TODO lookup-members + common-fields are repeated in each pass (unneccesary)
  const geometry = members.length
    ? {
        type: 'GeometryCollection' as const,
        geometries: members.map(({ geometry }) => geometry),
      }
    : undefined;

  return {
    ...getCommonFields(relation, geometry),
    properties: getRelationProperties(relation, members),
  };
};

const addToLookup = <T extends FeatureGeometry>(
  lookup: Lookup,
  items: GeojsonFeature<T>[],
) => {
  items.forEach((item) => {
    // @ts-ignore
    lookup[item.osmMeta.type][item.osmMeta.id] = item; // eslint-disable-line no-param-reassign
  });
};

const addParentIds = (lookup: Lookup, log: (message: string) => void) => {
  for (const relation of Object.values(lookup.relation)) {
    if (['area', 'crag'].includes(relation.tags?.climbing)) {
      for (const member of relation.members ?? []) {
        const child = lookup[member.type][member.ref]; // we know, that in lookup is the same object as in nodesOut/waysOut
        if (child) {
          if (child.properties.parentId) {
            log(
              `Child ${getUrlOsmId(child.osmMeta)} has more parents: ${child.properties.parentId} and ${relation.osmMeta.id}`,
            );
          }
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
  const lookup = { node: {}, way: {}, relation: {} } as Lookup;
  const { nodes, ways, relations } = getItems(response.elements, log);

  addToLookup(lookup, nodes.map(convertNode));

  addToLookup(
    lookup,
    ways.map((way) => convertWay(way, lookup)),
  );

  for (let i = 0; i < 3; i++) {
    addToLookup(
      lookup,
      relations.map((relation) => convertRelation(relation, lookup)),
    );
  }

  addParentIds(lookup, log);

  return {
    node: Object.values(lookup.node),
    way: Object.values(lookup.way),
    relation: Object.values(lookup.relation),
  };
};
