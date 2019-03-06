// @flow

import { fetchText, getApiId, parseXmlString } from './helpers';

export const OSM_API = 'https://www.openstreetmap.org/api/0.6';
export const OSM_FEATURE_URL = ({ type, id }) => `${OSM_API}/${type}/${id}`;

// https://wiki.openstreetmap.org/wiki/Overpass_API
export const OP_API = 'https://overpass-api.de/api/interpreter?data=';
export const OP_URL = query => OP_API + encodeURIComponent(query);
export const OP_QUERY = {
  node: id => `node(${id});out;`,
  way: id => `way(${id});(._;>;);out;`,
  relation: id => `rel(${id});(._;>;);out;`,
};
export const OP_FEATURE_URL = ({ type, id }) => OP_URL(OP_QUERY[type](id));

const coords = x => [parseFloat(x.$.lon), parseFloat(x.$.lat)];
const lookupNode = (osmXml, id) => osmXml.node.find(x => x.$.id === id);
const getGeometry = {
  node: (osmXml, node) => ({
    coordinates: coords(node),
  }),
  way: (osmXml, way) => ({
    type: 'LineString', // TODO Polygon
    coordinates: [way.nd.map(nd => coords(lookupNode(osmXml, nd.$.ref)))],
  }),
};

const subclassKeys = [
  'aerialway',
  'amenity',
  'barrier',
  'highway',
  'historic',
  'landuse',
  'leisure',
  'railway',
  'shop',
  'sport',
  'tourism',
  'waterway',
];
const subclassToClassRules = [
  {
    subclass: [
      'accessories',
      'antiques',
      'beauty',
      'bed',
      'boutique',
      'camera',
      'carpet',
      'charity',
      'chemist',
      'chocolate',
      'coffee',
      'computer',
      'confectionery',
      'convenience',
      'copyshop',
      'cosmetics',
      'garden_centre',
      'doityourself',
      'erotic',
      'electronics',
      'fabric',
      'florist',
      'frozen_food',
      'furniture',
      'video_games',
      'video',
      'general',
      'gift',
      'hardware',
      'hearing_aids',
      'hifi',
      'ice_cream',
      'interior_decoration',
      'jewelry',
      'kiosk',
      'lamps',
      'mall',
      'massage',
      'motorcycle',
      'mobile_phone',
      'newsagent',
      'optician',
      'outdoor',
      'perfumery',
      'perfume',
      'pet',
      'photo',
      'second_hand',
      'shoes',
      'sports',
      'stationery',
      'tailor',
      'tattoo',
      'ticket',
      'tobacco',
      'toys',
      'travel_agency',
      'watches',
      'weapons',
      'wholesale',
    ],
    resultClass: 'shop',
  },
  {
    subclass: ['townhall', 'public_building', 'courthouse', 'community_centre'],
    resultClass: 'town_hall',
  },
  {
    subclass: ['golf', 'golf_course', 'miniature_golf'],
    resultClass: 'golf',
  },
  {
    subclass: ['fast_food', 'food_court'],
    resultClass: 'fast_food',
  },
  {
    subclass: ['park', 'bbq'],
    resultClass: 'park',
  },
  {
    subclass: ['bus_stop', 'bus_station'],
    resultClass: 'bus',
  },
  {
    mappingKey: 'railway',
    subclass: ['station'],
    resultClass: 'railway',
  },
  {
    subclass: ['halt', 'tram_stop', 'subway'],
    resultClass: 'railway',
  },
  {
    mappingKey: 'aerialway',
    subclass: ['station'],
    resultClass: 'aerialway',
  },
  {
    subclass: ['subway_entrance', 'train_station_entrance'],
    resultClass: 'entrance',
  },
  {
    subclass: ['camp_site', 'caravan_site'],
    resultClass: 'campsite',
  },
  {
    subclass: ['laundry', 'dry_cleaning'],
    resultClass: 'laundry',
  },
  {
    subclass: [
      'supermarket',
      'deli',
      'delicatessen',
      'department_store',
      'greengrocer',
      'marketplace',
    ],
    resultClass: 'grocery',
  },
  {
    subclass: ['books', 'library'],
    resultClass: 'library',
  },
  {
    subclass: ['university', 'college'],
    resultClass: 'college',
  },
  {
    subclass: [
      'hotel',
      'motel',
      'bed_and_breakfast',
      'guest_house',
      'hostel',
      'chalet',
      'alpine_hut',
      'camp_site',
    ],
    resultClass: 'lodging',
  },
  {
    subclass: ['chocolate', 'confectionery'],
    resultClass: 'ice_cream',
  },
  {
    subclass: ['post_box', 'post_office'],
    resultClass: 'post',
  },
  {
    subclass: ['cafe'],
    resultClass: 'cafe',
  },
  {
    subclass: ['school', 'kindergarten'],
    resultClass: 'school',
  },
  {
    subclass: ['alcohol', 'beverages', 'wine'],
    resultClass: 'alcohol_shop',
  },
  {
    subclass: ['bar', 'nightclub'],
    resultClass: 'bar',
  },
  {
    subclass: ['marina', 'dock'],
    resultClass: 'harbor',
  },
  {
    subclass: ['car', 'car_repair', 'taxi'],
    resultClass: 'car',
  },
  {
    subclass: ['hospital', 'nursing_home', 'clinic'],
    resultClass: 'hospital',
  },
  {
    subclass: ['grave_yard', 'cemetery'],
    resultClass: 'cemetery',
  },
  {
    subclass: ['attraction', 'viewpoint'],
    resultClass: 'attraction',
  },
  {
    subclass: ['biergarten', 'pub'],
    resultClass: 'beer',
  },
  {
    subclass: ['music', 'musical_instrument'],
    resultClass: 'music',
  },
  {
    subclass: ['american_football', 'stadium', 'soccer'],
    resultClass: 'stadium',
  },
  {
    subclass: ['art', 'artwork', 'gallery', 'arts_centre'],
    resultClass: 'art_gallery',
  },
  {
    subclass: ['bag', 'clothes'],
    resultClass: 'clothing_store',
  },
  {
    subclass: ['swimming_area', 'swimming'],
    resultClass: 'swimming',
  },
  {
    subclass: ['castle', 'ruins'],
    resultClass: 'castle',
  },
];

const getPoiClass = tags => {
  const mappingKey = subclassKeys.find(x => x in tags);
  const subclass = tags[mappingKey];
  const resultRule = subclassToClassRules.find(rule => {
    const mappingKeyMatchedOrNone =
      !rule.mappingKey || rule.mappingKey === mappingKey;
    const subclassMatched = rule.subclass.includes(subclass);
    return mappingKeyMatchedOrNone && subclassMatched;
  });
  const cls = resultRule ? resultRule.resultClass : subclass;
  return { class: cls, subclass };
};

export const osmToGeojson = async osmXmlStr => {
  const osmXml = await parseXmlString(osmXmlStr);

  const type = osmXml.relation ? 'relation' : osmXml.way ? 'way' : 'node';
  const item = osmXml[type];
  if (!item) {
    throw 'Empty osmXml result';
  }

  const osmMeta = { type, ...item.$ };
  const tagItems = item.tag.length ? item.tag : [item.tag];
  const tags = tagItems.reduce(
    (acc, { $: { k, v } }) => ({ ...acc, [k]: v }),
    {},
  );

  return {
    type: 'Feature',
    geometry: getGeometry[type](osmXml, item),
    osmMeta,
    tags,
    properties: getPoiClass(tags),
  };
};

export const getFeatureFromApi = async featureId => {
  const apiId = getApiId(featureId);
  const isNode = apiId.type === 'node';
  const url = isNode ? OSM_FEATURE_URL(apiId) : OP_FEATURE_URL(apiId);

  const response = await fetchText(url, { putInAbortableQueue: true });
  const geojson = await osmToGeojson(response);
  console.log('fetched feature', geojson); // eslint-disable-line no-console
  return geojson;
};
