import {
  FeatureGeometry,
  FeatureTags,
  GeometryCollection,
  LineString,
  OsmId,
  Point,
} from '../../../services/types';
import { join } from '../../../utils';
import { getCenter } from '../../../services/getCenter';
import { getDifficultyColorByTags } from '../../../services/tagging/climbing/routeGrade';

type OsmType = 'node' | 'way' | 'relation';
type OsmNode = {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};
type OsmWay = {
  type: 'way';
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
};
type OsmRelation = {
  type: 'relation';
  id: number;
  members?: {
    type: OsmType;
    ref: number;
    role: string;
  }[];
  tags?: Record<string, string>;
  center?: { lat: number; lon: number }; // only for overpass `out center` queries
};
type OsmItem = OsmNode | OsmWay | OsmRelation;
export type OsmResponse = {
  elements: OsmItem[];
  osm3s: { timestamp_osm_base: string }; // overpass only
};

export type GeojsonFeature<T extends FeatureGeometry = FeatureGeometry> = {
  type: 'Feature';
  id: number;
  osmMeta: OsmId;
  tags: FeatureTags;
  properties: {
    // climbing?: string;
    // osmappRouteCount?: number;

    routeCount?: number; // for relations climbing=crag,area
    hasImages?: boolean; // for climbing=route*,crag,area

    // osmappType?: 'node' | 'way' | 'relation';
    // osmappLabel?: string;
    // color?: string;
  };
  geometry: T;
  center?: number[];
  members?: OsmRelation['members'];
};

type Lookup = {
  node: Record<number, GeojsonFeature<Point>>;
  way: Record<number, GeojsonFeature<LineString>>;
  relation: Record<number, GeojsonFeature<GeometryCollection>>;
};

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

const numberToSuperScript = (number?: number) =>
  number && number > 1
    ? number.toString().replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d])
    : '';

// const getLabel = (tags: FeatureTags, osmappRouteCount: number) =>
//   join(
//     getNameWithDifficulty(tags),
//     '\n',
//     numberToSuperScript(osmappRouteCount),
//   );

const getRouteNumberFromTags = (element: OsmItem) => {
  // TODO sum all types
  const number = parseFloat(element.tags['climbing:sport'] ?? '0');

  // can be eg. "yes" .. eg. relation/15056469
  return Number.isNaN(number) ? 1 : number;
};

const convert = <T extends OsmItem, TGeometry extends FeatureGeometry>(
  element: T,
  geometryFn: (element: T) => TGeometry,
): GeojsonFeature<TGeometry> => {
  const { type, id, tags = {} } = element;
  const geometry = geometryFn(element);
  const center = getCenter(geometry) ?? undefined;
  const osmappRouteCount =
    element.tags?.climbing === 'crag'
      ? Math.max(
          element.type === 'relation'
            ? element.members.filter((member) => member.role === '').length
            : 0,
          getRouteNumberFromTags(element),
        )
      : undefined;

  // const color = tags?.climbing?.startsWith('route')
  //   ? getDifficultyColorByTags(tags, 'light')
  //   : undefined;

  const properties: GeojsonFeature['properties'] = {
    //osmappLabel: getLabel(tags, osmappRouteCount),
    // osmappLabel: getNameWithDifficulty(tags),

    routeCount: osmappRouteCount,
    hasImages: Object.keys(tags).some((key) =>
      key.startsWith('wikimedia_commons'),
    ),
    // ...(color ? { color } : {}),
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

const getRelationWithAreaCount = (
  relations: GeojsonFeature[],
  lookup: Record<string, Record<string, GeojsonFeature>>,
): GeojsonFeature[] =>
  relations.map((relation) => {
    if (relation.tags?.climbing === 'area') {
      const members = relation.members.map(
        ({ type, ref }) => lookup[type][ref]?.properties,
      );
      const routeCount = members
        .map((member) => member?.routeCount ?? 0)
        .reduce((acc, count) => acc + count);
      const hasImages = members.some((member) => member?.hasImages);

      return {
        ...relation,
        properties: {
          ...relation.properties,
          routeCount,
          hasImages,
          // osmappLabel: getLabel(relation.tags, routeCount),
        },
      };
    }

    return relation;
  });

export const overpassToGeojsons = (
  response: OsmResponse,
  log: (message: string) => void,
) => {
  const { nodes, ways, relations } = getItems(response.elements, log);

  const lookup = { node: {}, way: {}, relation: {} } as Lookup;

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

  const relationsOut3 = getRelationWithAreaCount(relationsOut2, lookup);

  return { node: nodesOut, way: waysOut, relation: relationsOut3 };
};
