import { Feature, OsmId } from '../../../services/types';
import { getShortId } from '../../../services/helpers';
import { quickFetchFeature } from '../../../services/osm/osmApi';
import { MapGeoJSONFeature } from 'maplibre-gl';

const isFarAway = (feature: Feature, skeleton: Feature) =>
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

// Maptiler is not encoding IDs correctly, sometimes type encoding is missing, sometimes the type is just wrong
// This function tries to fix the ID by fetching possible variants and comparing them by name and distance
// more in: https://github.com/openmaptiles/openmaptiles/issues/1587

const num = (n: string | number) => Number(`${n}`);

export const maptilerFix = async (
  mapFeature: MapGeoJSONFeature,
  skeleton: Feature,
  mapId: string | number,
) => {
  const { source } = mapFeature;
  const mapFeatureId = num(mapFeature.id);
  if (source !== 'maptiler_planet') {
    return skeleton;
  }

  const feature = await quickFetchFeature(skeleton.osmMeta); // this is cached, so real fetchFeature after router would be fast

  if (!isMaptilerCorruptedId(feature, skeleton)) {
    return skeleton;
  }

  const { type, id } = skeleton.osmMeta;

  const variants: OsmId[] = [
    // same id, but different type
    ...(type !== 'node' ? [{ type: 'node' as const, id }] : []),
    ...(type !== 'way' ? [{ type: 'way' as const, id }] : []),
    ...(type !== 'relation' ? [{ type: 'relation' as const, id }] : []),
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
    ({ tags }) => tags.name === skeleton.tags.name,
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
