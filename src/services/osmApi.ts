import { resolveCountryCode } from 'next-codegrid';
import {
  FetchError,
  getApiId,
  getShortId,
  getUrlOsmId,
  OsmApiId,
  prod,
} from './helpers';
import { fetchJson } from './fetch';
import { Feature, LonLat, Position } from './types';
import { removeFetchCache } from './fetchCache';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';
import { isBrowser } from '../components/helpers';
import { addSchemaToFeature } from './tagging/idTaggingScheme';
import { fetchSchemaTranslations } from './tagging/translations';
import { osmToFeature } from './osmToFeature';
import { mergeMemberImages } from './images/getImageTags';
import { captureException } from '../helpers/sentry';

const getOsmUrl = ({ type, id }) =>
  `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`;
const getOsmFullUrl = ({ type, id }) =>
  `https://api.openstreetmap.org/api/0.6/${type}/${id}/full.json`;
const getOsmParentUrl = ({ type, id }) =>
  `https://api.openstreetmap.org/api/0.6/${type}/${id}/relations.json`;
const getOsmHistoryUrl = ({ type, id }) =>
  `https://api.openstreetmap.org/api/0.6/${type}/${id}/history.json`;

const getOverpassCenterUrl = ({ type, id }) => {
  const queries = {
    way: (wId) => `[out:json][timeout:1];way(${wId});out 1 ids qt center;`,
    relation: (rId) => `[out:json][timeout:1];rel(${rId});out 1 ids qt center;`,
  };
  return `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    queries[type](id),
  )}`;
};

const getOsmPromise = async (apiId) => {
  try {
    const { elements } = await fetchJson(getOsmUrl(apiId)); // TODO 504 gateway busy
    return elements?.[0];
  } catch (e) {
    if (e instanceof FetchError && e.code === '410') {
      const { elements } = await fetchJson(getOsmHistoryUrl(apiId)); // TODO use multi fetch instead of history: https://wiki.openstreetmap.org/wiki/API_v0.6#Multi_fetch:_GET_/api/0.6/[nodes|ways|relations]?#parameters
      const length = elements?.length;

      if (length >= 2) {
        const lastWithTags = elements[length - 2];
        const last = elements[length - 1];
        return { ...lastWithTags, ...last, osmappDeletedMarker: true };
      }
    }
    throw e;
  }
};

const getOsmParentPromise = async (apiId) => {
  const { elements } = await fetchJson(getOsmParentUrl(apiId));
  return { elements };
};

/**
 * This holds coords of clicked ways/relations (from vector map), these are often different than those computed by us
 * TODO: we should probably store just the last one, but this cant get too big, right?
 */
const featureCenterCache = {};
export const addFeatureCenterToCache = (shortId, center) => {
  featureCenterCache[shortId] = center;
};

const getCenterPromise = async (apiId): Promise<LonLat | false> => {
  if (apiId.type === 'node') return false;

  if (isBrowser() && featureCenterCache[getShortId(apiId)]) {
    return featureCenterCache[getShortId(apiId)]; // just use the coordinate where user clicked
  }

  try {
    const response = await fetchJson(getOverpassCenterUrl(apiId));
    const { lat, lon } = response?.elements?.[0]?.center ?? {};
    return lon && lat ? [lon, lat] : false; // there are no coordinates for relation of relations
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getCenterPromise()', e); // eg. 529 too many requests
    return false;
  }
};

export const clearFeatureCache = (apiId) => {
  removeFetchCache(getOsmUrl(apiId)); // watch out, must be same as in getOsmPromise()
  removeFetchCache(getOsmHistoryUrl(apiId));
};

const fetchFeatureWithCenter = async (apiId: OsmApiId) => {
  const [element, center] = await Promise.all([
    getOsmPromise(apiId),
    getCenterPromise(apiId),
    fetchSchemaTranslations(), // TODO this should be mocked in test??? could be moved to setIntl or something
  ]);

  const feature = osmToFeature(element);
  if (!feature.center && center) {
    feature.center = center;
  }

  // center point is missing for relation of relations (overpass in getCenterPromise returns false)
  if (feature.center) {
    try {
      feature.countryCode = await resolveCountryCode(feature.center); // takes 0-100ms for first resolution, then instant
    } catch (e) {
      console.warn('countryCode left empty – resolveCountryCode():', e); // eslint-disable-line no-console
      captureException(e, { extra: { feature } });
    }
  }

  return addSchemaToFeature(feature);
};

const fetchParentFeatures = async (apiId: OsmApiId) => {
  const { elements } = await getOsmParentPromise(apiId);
  return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
};

const getItemsMap = (elements) => {
  const map = { node: {}, way: {}, relation: {} };
  elements.forEach((element) => {
    map[element.type][element.id] = element;
  });
  return map;
};

const fetchMemberFeatures = async (apiId: OsmApiId) => {
  // TODO we can compute geometry using cragsToGeojson() and display it in the map
  const full = await fetchJson(getOsmFullUrl(apiId));
  const map = getItemsMap(full.elements);
  const mainFeature = map[apiId.type][apiId.id];

  return mainFeature.members.map(({ type, ref, role }) => {
    const element = map[type][ref];
    if (!element) {
      return null;
    }

    const feature = addSchemaToFeature(osmToFeature(element));
    feature.osmMeta.role = role;
    return feature;
  });
};

export const isClimbingRelation = (feature: Feature) =>
  feature.osmMeta.type === 'relation' &&
  (feature.tags.climbing === 'crag' || feature.tags.climbing === 'area');

// TODO parent should be probably fetched for every feaure in fetchFeatureWithCenter()
//  - wait until UI is prepared
//  - maybe this can be merged in fetchFeatureWithCenter()
//  - check: Warning: data for page "/[[...all]]" (path "/relation/4810774") is 627 kB which exceeds the threshold of 128 kB, this amount of data can reduce performance. See more info here: https://nextjs.org/docs/messages/large-page-data
export const addMembersAndParents = async (
  feature: Feature,
): Promise<Feature> => {
  if (feature.tags.climbing?.includes('route')) {
    const parentFeatures = await fetchParentFeatures(feature.osmMeta);

    return {
      ...feature,
      parentFeatures,
    };
  }

  if (!isClimbingRelation(feature)) {
    return feature;
  }

  const [parentFeatures, memberFeatures] = await Promise.all([
    fetchParentFeatures(feature.osmMeta),
    fetchMemberFeatures(feature.osmMeta),
  ]);

  mergeMemberImages(feature, memberFeatures); // TODO test

  return { ...feature, memberFeatures, parentFeatures };
};

export const fetchFeature = async (shortId): Promise<Feature> => {
  if (!shortId) {
    return null;
  }

  try {
    const apiId = getApiId(shortId);

    if (apiId.type === 'relation' && apiId.id === '6') {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./osmApiTestItems');
      return osmApiTestItems.TEST_CRAG;
    }
    if (apiId.type === 'node' && apiId.id === '6') {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./osmApiTestItems');
      return osmApiTestItems.TEST_NODE;
    }

    const feature = await fetchFeatureWithCenter(apiId);
    const finalFeature = await addMembersAndParents(feature);

    return finalFeature;
  } catch (e) {
    console.error(`fetchFeature(${shortId}):`, e); // eslint-disable-line no-console

    const error = (
      e instanceof FetchError ? e.code : 'unknown'
    ) as Feature['error'];

    return {
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: getApiId(shortId),
      center: undefined,
      tags: { name: getUrlOsmId(getApiId(shortId)) },
      properties: { class: '', subclass: '' },
      error,
    };
  }
};

export const insertOsmNote = async (point: Position, text: string) => {
  const [lon, lat] = point;

  const body = new URLSearchParams();
  body.append('lat', `${lat}`);
  body.append('lon', `${lon}`);
  body.append('text', text);

  const osmUrl = prod
    ? 'https://api.openstreetmap.org'
    : 'https://master.apis.dev.openstreetmap.org';

  // {"type":"Feature","geometry":{"type":"Point","coordinates":[14.3244982,50.0927863]},"properties":{"id":26569,"url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569.json","comment_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/comment.json","close_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/close.json","date_created":"2021-04-17 10:37:44 UTC","status":"open","comments":[{"date":"2021-04-17 10:37:44 UTC","action":"opened","text":"way/39695868! Place was marked permanently closed.From https://osmapp.org/way/39695868","html":"\u003cp\u003eway/39695868! Place was marked permanently closed.From \u003ca href=\"https://osmapp.org/way/39695868\" rel=\"nofollow noopener noreferrer\"\u003ehttps://osmapp.org/way/39695868\u003c/a\u003e\u003c/p\u003e"}]}}
  const reply = await fetchJson(`${osmUrl}/api/0.6/notes.json`, {
    nocache: true,
    method: 'POST',
    body,
  });

  const noteId = reply.properties.id;
  return {
    type: 'note',
    text,
    url: `${prod ? 'https://osm.org' : osmUrl}/note/${noteId}`,
  };
};

const getAroundUrl = ([lat, lon]: Position) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    `[timeout:5][out:json];(
        relation[~"."~"."](around:50,${lon},${lat});
        way[~"."~"."](around:50,${lon},${lat});
        node[~"."~"."](around:50,${lon},${lat});
      );out 20 body qt center;`, // some will be filtered out
  )}`;

export const fetchAroundFeature = async (point: Position) => {
  const response = await fetchJson(getAroundUrl(point));
  return overpassAroundToSkeletons(response);
};
