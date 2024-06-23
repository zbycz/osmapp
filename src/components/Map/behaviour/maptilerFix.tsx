import { Feature } from '../../../services/types';
import { FetchError, getShortId, OsmApiId } from '../../../services/helpers';
import { osmToFeature } from '../../../services/osmToFeature';
import { fetchJson } from '../../../services/fetch';

const isFarAway = (feature, skeleton) =>
  feature.center &&
  skeleton.center &&
  Math.abs(feature.center[0] - skeleton.center[0]) > 0.1 &&
  Math.abs(feature.center[1] - skeleton.center[1]) > 0.1;

const isMaptilerCorruptedId = (feature: Feature, skeleton: Feature) => {
  if (feature.error === '404') {
    return true;
  }

  if (feature.tags.name !== skeleton.tags.name) {
    return true;
  }

  if (isFarAway(feature, skeleton)) {
    return true;
  }

  return false;
};

const getQuickOsmPromise = async (apiId: OsmApiId) => {
  const getOsmUrl = ({ type, id }) =>
    `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`;
  const { elements } = await fetchJson(getOsmUrl(apiId)); // TODO 504 gateway busy
  return elements?.[0];
};

const quickFetchFeature = async (apiId: OsmApiId) => {
  try {
    const element = await getQuickOsmPromise(apiId);
    return osmToFeature(element);
  } catch (e) {
    return {
      error: e instanceof FetchError ? e.code : 'unknown',
    } as unknown as Feature;
  }
};

// Maptiler is not encoding IDs correctly, sometimes type encoding is missing, sometimes the type is just wrong
// This function tries to fix the ID by fetching possible variants and comparing them by name and distance
// more in: https://github.com/openmaptiles/openmaptiles/issues/1587

export const maptilerFix = async (mapFeature, skeleton, mapId) => {
  const { source, id: mapFeatureId } = mapFeature;
  if (source !== 'maptiler_planet') {
    return skeleton;
  }

  const feature = await quickFetchFeature(skeleton.osmMeta); // this is cached, so real fetchFeature after router would be fast

  if (!isMaptilerCorruptedId(feature, skeleton)) {
    return skeleton;
  }

  const { type, id } = skeleton.osmMeta;

  const variants = [
    // same id, but different type
    ...(type !== 'node' ? [{ type: 'node', id }] : []),
    ...(type !== 'way' ? [{ type: 'way', id }] : []),
    ...(type !== 'relation' ? [{ type: 'relation', id }] : []),
    // raw id, without recognized type
    { type: 'node', id: mapFeatureId },
    { type: 'way', id: mapFeatureId },
    { type: 'relation', id: mapFeatureId },
  ];

  const promises = variants.map((osmMeta) => quickFetchFeature(osmMeta));
  console.group(`maptilerFix(id=${mapId}):`); // eslint-disable-line no-console
  console.warn('maptilerFix(): fetching possible id variants:', variants); // eslint-disable-line no-console
  const possibleFeatures = await Promise.all(promises);
  const existingFeatures = possibleFeatures.filter(
    (f) => f?.error === undefined,
  );

  const nameHit = existingFeatures.find(
    (f) => f.tags.name === skeleton.tags.name,
  );
  if (nameHit) {
    // eslint-disable-next-line no-console
    console.warn('maptilerFix(): found correct id by name match', {
      oldMapId: mapId,
      newOsmId: getShortId(nameHit.osmMeta),
    });
    console.groupEnd(); // eslint-disable-line no-console
    return nameHit;
  }

  const closeHit = existingFeatures.find((f) => isFarAway(f, skeleton));
  if (closeHit) {
    // eslint-disable-next-line no-console
    console.warn('maptilerFix(): found correct id by close match', {
      oldMapId: mapId,
      newOsmId: getShortId(closeHit.osmMeta),
    });
    console.groupEnd(); // eslint-disable-line no-console
    return closeHit;
  }

  console.warn('maptilerFix(): no correct id found', { existingFeatures }); // eslint-disable-line no-console
  console.groupEnd(); // eslint-disable-line no-console
  return skeleton;
};
