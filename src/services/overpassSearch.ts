import { Feature, LineString, Point } from "./types";
import { getPoiClass } from "./getPoiClass";
import { getCenter } from "./getCenter";
import { OsmApiId } from "./helpers";
import { fetchJson } from "./fetch";
import { getGlobalMap } from "./mapStorage";

const overpassQuery = (bbox) => `[out:json][timeout:25];
(
  node["sport"="climbing"](${bbox});
  way["sport"="climbing"](${bbox});
  relation["sport"="climbing"](${bbox});
  node["climbing"="route_bottom"](${bbox});
  way["climbing"="route_bottom"](${bbox});
  relation["climbing"="route_bottom"](${bbox});
);
out body;
>;
out skel qt;`;

const getOverpassUrl = ([a, b, c, d]) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    overpassQuery([d, a, b, c])
  )}`;

const notNull = (x) => x != null;

const getGeometry = {
  node: ({ lat, lon }): Point => ({ type: "Point", coordinates: [lon, lat] }),
  way: (foo): LineString => {
    const { geometry } = foo;
    return {
      type: "LineString",
      coordinates: geometry?.filter(notNull)?.map(({ lat, lon }) => [lon, lat])
    };
  },
  relation: ({ members }): LineString => ({
    type: "LineString",
    coordinates: members[0]?.geometry
      ?.filter(notNull)
      ?.map(({ lat, lon }) => [lon, lat])
  })
};

export const overpassAroundToSkeletons = (response: any): Feature[] =>
  response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = getGeometry[type]?.(element);
    return {
      type: "Feature",
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), tags },
      geometry,
      center: getCenter(geometry) ?? undefined
    };
  });

// maybe take inspiration from https://github.com/tyrasd/osmtogeojson/blob/gh-pages/index.js
const osmJsonToSkeletons = (response: any): Feature[] => {
  const nodesById = response.elements
    .filter((element) => element.type === "node")
    .reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

  const getGeometry2 = {
    node: ({ lat, lon }): Point => ({ type: "Point", coordinates: [lon, lat] }),
    way: (way): LineString => {
      const { nodes } = way;
      return {
        type: "LineString",
        coordinates: nodes
          ?.map((nodeId) => nodesById[nodeId])
          .map(({ lat, lon }) => [lon, lat])
      };
    },
    relation: ({ members }): LineString => ({
      type: "LineString",
      coordinates: members[0]?.geometry
        ?.filter(notNull)
        ?.map(({ lat, lon }) => [lon, lat])
    })
  };

  return response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = getGeometry2[type]?.(element);
    return {
      type: "Feature",
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), ...tags },
      geometry,
      center: getCenter(geometry) ?? undefined
    };
  });
};

const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

export async function performOverpassSearch(bbox) {
  const overpass = await fetchJson(getOverpassUrl(bbox));
  console.log(overpass);
  const map = getGlobalMap();
  // put overpass features on mapbox gl map
  const features = osmJsonToSkeletons(overpass)
    .filter(
      (feature) => feature.center && Object.keys(feature.tags).length > 0
    )
    .map((feature) => ({
      ...feature,
      id: convertOsmIdToMapId(feature.osmMeta)
    }));
  console.log("overpass geojson", features);
  map.getSource("overpass")?.setData({ type: "FeatureCollection", features });
}
