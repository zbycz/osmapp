import { LineString, Point, Position } from './types';
import { parseXmlString } from './helpers';
import { getPoiClass } from './getPoiClass';

const coords = (x): Position => [parseFloat(x.$.lon), parseFloat(x.$.lat)];
const lookupNode = (osmXml, id) => osmXml.node.find((x) => x.$.id === id);

const getGeometry = {
  node: (osmXml, node): Point => ({
    type: 'Point',
    coordinates: coords(node),
  }),

  way: (osmXml, way): LineString => ({
    type: 'LineString', // TODO Polygon
    coordinates: way.nd.map((nd) => coords(lookupNode(osmXml, nd.$.ref))),
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  relation: (osmXml, relation): LineString => ({
    type: 'LineString',
    coordinates: [osmXml.node.map((nd) => coords(nd))],
  }),
};

export const osmToGeojson = async (osmXmlStr) => {
  const osmXml = await parseXmlString(osmXmlStr);

  // eslint-disable-next-line no-nested-ternary
  const type = osmXml.relation ? 'relation' : osmXml.way ? 'way' : 'node';
  const item = osmXml[type];
  if (!item) {
    throw new Error('Empty osmXml result');
  }

  const osmMeta = { type, ...item.$ };
  const tagItems = item.tag.length ? item.tag : [item.tag];
  const tags = tagItems.reduce(
    (acc, { $: { k, v } }) => ({ ...acc, [k]: v }),
    {},
  );

  return {
    type: 'Feature' as const,
    geometry: getGeometry[type](osmXml, item),
    osmMeta,
    tags,
    properties: getPoiClass(tags),
  };
};
