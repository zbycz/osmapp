import { FetchError, getShortId, getUrlOsmId } from '../helpers';
import { fetchJson } from '../fetch';
import { Feature, LonLat, OsmId } from '../types';
import { removeFetchCache } from '../fetchCache';
import { isBrowser } from '../../components/helpers';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { fetchSchemaTranslations } from '../tagging/translations';
import { osmToFeature } from './osmToFeature';
import { getImageDefs, mergeMemberImageDefs } from '../images/getImageDefs';
import { fetchOverpassCenter } from '../overpass/fetchOverpassCenter';
import {
  isClimbingRelation,
  isFeatureClimbingRoute,
  isPublictransportRoute,
  isRouteMaster,
} from '../../utils';
import { getOverpassUrl } from '../overpass/overpassSearch';
import { getOsmHistoryUrl, getOsmUrl } from './urls';
import { getOsmElement } from './quickFetchFeature';
import { fetchParentFeatures } from './fetchParentFeatures';
import { featureCenterCache } from './featureCenterToCache';
import { getCountryCode } from './getCountryCode';
import { getItemsMap, getMemberFeatures } from './helpers';
import { getFullFeatureWithMemberFeatures } from './getFullFeatureWithMemberFeatures';

const getOsmPromise = async (apiId: OsmId) => {
  try {
    return await getOsmElement(apiId);
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

const getCenterPromise = async (apiId: OsmId): Promise<LonLat | false> => {
  if (apiId.type === 'node') return false;

  if (isBrowser() && featureCenterCache[getShortId(apiId)]) {
    return featureCenterCache[getShortId(apiId)]; // just use the coordinate where user clicked
  }

  try {
    return await fetchOverpassCenter(apiId);
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

const getRelationElementsAndCenter = async (apiId: OsmId) => {
  const element = await getOsmPromise(apiId);
  const getPositionOfFirstItem =
    isPublictransportRoute({ tags: element.tags }) ||
    isRouteMaster({
      tags: element.tags,
      osmMeta: apiId,
    });
  const center = getPositionOfFirstItem
    ? await fetchOverpassCenter({
        id: element.members[0].ref,
        type: element.members[0].type,
      })
    : await fetchOverpassCenter(apiId);

  return { element, center };
};

const getElementsAndCenter = async (apiId: OsmId) => {
  const cachedCenter = featureCenterCache[getShortId(apiId)];
  if (isBrowser() && cachedCenter) {
    return {
      center: cachedCenter,
      element: await getOsmPromise(apiId),
    };
  }
  switch (apiId.type) {
    case 'node':
      return {
        element: await getOsmPromise(apiId),
        center: false as const,
      };
    case 'way':
      const [elementWay, center] = await Promise.all([
        getOsmPromise(apiId),
        getCenterPromise(apiId),
      ]);
      return { element: elementWay, center };
    case 'relation':
      return getRelationElementsAndCenter(apiId);
  }
};

const fetchFeatureWithCenter = async (apiId: OsmId) => {
  const [{ element, center }] = await Promise.all([
    getElementsAndCenter(apiId),
    fetchSchemaTranslations(),
  ]);

  const feature = osmToFeature(element);
  if (!feature.center && center) {
    feature.center = center;
    feature.imageDefs = getImageDefs(
      feature.tags,
      feature.osmMeta.type,
      center,
    );
  }

  if (feature.center) {
    const countryCode = await getCountryCode(feature);
    if (countryCode) {
      feature.countryCode = countryCode;
    }
  }

  return addSchemaToFeature(feature);
};

const addMemberFeaturesToArea = async (relation: Feature) => {
  const { osmMeta } = relation;
  const url = getOverpassUrl(`[out:json];rel(${osmMeta.id});>>;out center qt;`);
  const overpass = await fetchJson(url);
  const itemsMap = getItemsMap(overpass.elements);
  const memberFeatures = getMemberFeatures(relation.members, itemsMap).map(
    (memberFeature) => {
      const crag: Feature = {
        ...memberFeature,
        memberFeatures: getMemberFeatures(memberFeature.members, itemsMap),
      };
      mergeMemberImageDefs(crag);
      return crag;
    },
  );

  // TODO merge this with osmToFeature()
  if (relation.center) {
    const countryCode = await getCountryCode(relation);
    if (countryCode) {
      relation.countryCode = countryCode;
    }
  }

  return { ...relation, memberFeatures };
};

const addMemberFeaturesToRelation = async (relation: Feature) => {
  const { tags, osmMeta: apiId } = relation;
  if (apiId.type !== 'relation') {
    throw new Error('addMemberFeaturesToRelation() called with non-relation');
  }

  if (tags.climbing === 'area') {
    return await addMemberFeaturesToArea(relation);
  }

  const full = await getFullFeatureWithMemberFeatures(apiId);
  const out: Feature = {
    ...relation,
    memberFeatures: full.memberFeatures,
  };
  mergeMemberImageDefs(out);
  return out;
};

// TODO parent should be probably fetched for every feaure in fetchFeatureWithCenter()
//  - wait until UI is prepared
//  - maybe this can be merged in fetchFeatureWithCenter()
//  - check: Warning: data for page "/[[...all]]" (path "/relation/4810774") is 627 kB which exceeds the threshold of 128 kB, this amount of data can reduce performance. See more info here: https://nextjs.org/docs/messages/large-page-data
const addMembersAndParents = async (feature: Feature): Promise<Feature> => {
  if (isFeatureClimbingRoute(feature)) {
    const parentFeatures = await fetchParentFeatures(feature.osmMeta);
    return { ...feature, parentFeatures };
  }

  if (
    isClimbingRelation(feature) ||
    isPublictransportRoute(feature) ||
    isRouteMaster(feature)
  ) {
    const [parentFeatures, featureWithMemberFeatures] = await Promise.all([
      fetchParentFeatures(feature.osmMeta),
      addMemberFeaturesToRelation(feature),
    ]);

    return {
      ...featureWithMemberFeatures,
      center: feature.center, // feature contains correct center from centerCache or overpass
      parentFeatures,
    };
  }

  return feature;
};

export const fetchFeature = async (apiId: OsmId): Promise<Feature> => {
  try {
    // offline features for testing
    if (apiId.type === 'relation' && apiId.id === 6) {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./offlineItems');
      return osmApiTestItems.TEST_CRAG;
    }
    if (apiId.type === 'node' && apiId.id === 6) {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./offlineItems');
      return osmApiTestItems.TEST_NODE;
    }

    const feature = await fetchFeatureWithCenter(apiId);
    const finalFeature = await addMembersAndParents(feature);

    return finalFeature;
  } catch (e) {
    console.error(`fetchFeature(${getShortId(apiId)}):`, e); // eslint-disable-line no-console

    const error = (
      e instanceof FetchError ? e.code : 'unknown'
    ) as Feature['error'];

    return {
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: apiId,
      center: undefined,
      tags: { name: getUrlOsmId(apiId) },
      properties: { class: '', subclass: '' },
      error,
    };
  }
};
