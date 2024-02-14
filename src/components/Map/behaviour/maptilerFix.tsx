import { Feature } from '../../../services/types';
import { getShortId } from '../../../services/helpers';
import {
  addFeatureCenterToCache,
  fetchFeature,
} from '../../../services/osmApi';

const isClose = (feature, skeleton) => {
  const isCloseCoord = (a, b) => Math.abs(a - b) < 0.1;
  return (
    feature.center &&
    skeleton.center &&
    isCloseCoord(feature.center[0], skeleton.center[0]) &&
    isCloseCoord(feature.center[1], skeleton.center[1])
  );
};

const isMaptilerCorruptedId = (feature: Feature, skeleton: Feature) => {
  if (feature.error === '404') {
    return true;
  }

  if (feature.tags.name !== skeleton.tags.name) {
    return true;
  }

  if (!isClose(feature, skeleton)) {
    return true;
  }

  return false;
};

// Maptiler is not encoding IDs correctly, sometimes type encoding is missing, sometimes the type is just wrong
// This function tries to fix the ID by fetching possible variants and comparing them by name and distance
// more in: https://github.com/openmaptiles/openmaptiles/issues/1587

export const maptilerFix = async (mapFeatureId, skeleton) => {
  const shortId = getShortId(skeleton.osmMeta);
  const feature = await fetchFeature(shortId); // this is cached, so real fetchFeature after router would be fast

  if (isMaptilerCorruptedId(feature, skeleton)) {
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

    const promises = variants.map((osmMeta) => fetchFeature(osmMeta));
    console.warn('maptiler fix: fetching possible id variants:', variants); // eslint-disable-line no-console
    const possibleFeatures = await Promise.all(promises);
    const existingFeatures = possibleFeatures.filter(
      (f) => f?.error === undefined,
    );

    const nameHit = existingFeatures.find(
      (f) => f.tags.name === skeleton.tags.name,
    );
    if (nameHit) {
      const newId = getShortId(nameHit.osmMeta);

      // eslint-disable-next-line no-console
      console.warn('maptiler fix: found correct id by name match', {
        oldId: shortId,
        newId,
      });
      addFeatureCenterToCache(newId, skeleton.center);
      return nameHit;
    }

    const closeHit = existingFeatures.find((f) => isClose(f, skeleton));
    if (closeHit) {
      const newId = getShortId(closeHit.osmMeta);

      // eslint-disable-next-line no-console
      console.warn('maptiler fix: found correct id by close match', {
        oldId: shortId,
        newId,
      });
      addFeatureCenterToCache(newId, skeleton.center);
      return closeHit;
    }

    console.warn('maptiler fix: no correct id found', { existingFeatures }); // eslint-disable-line no-console
  }

  return skeleton;
};
