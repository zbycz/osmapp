import Router from 'next/router';
import { createMapEventHook, isMobileDevice } from '../../helpers';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import {
  getShortId,
  getUrlOsmId,
  isSameOsmId,
} from '../../../services/helpers';
import { getRoundedPosition, publishDbgObject } from '../../../utils';
import { getCenter } from '../../../services/getCenter';
import { convertMapIdToOsmId, getIsOsmObject } from '../helpers';
import { getCoordsFeature } from '../../../services/getCoordsFeature';
import { maptilerFix } from './maptilerFix';

export const getSkeleton = (feature, clickCoords) => {
  const isOsmObject = getIsOsmObject(feature);
  const osmMeta = isOsmObject
    ? convertMapIdToOsmId(feature)
    : { type: feature.layer.id, id: feature.id };

  return {
    ...feature,
    geometry: feature.geometry,
    center: getCenter(feature.geometry) || clickCoords,
    osmMeta,
    tags: { name: feature.properties?.name },
    skeleton: true,
    nonOsmObject: !isOsmObject,
  };
};

const coordsFeatureSetter = (coords, zoom) => {
  if (isMobileDevice()) {
    return null; // handled by useOnMapLongPressed
  }

  return (previousFeature) =>
    previousFeature ? null : getCoordsFeature(getRoundedPosition(coords, zoom));
};

export const useOnMapClicked = createMapEventHook((map, setFeature) => ({
  eventType: 'click',
  eventHandler: async ({ point }) => {
    const coords = map.unproject(point).toArray();
    const features = map.queryRenderedFeatures(point);
    if (!features.length) {
      setFeature(coordsFeatureSetter(coords, map.getZoom()));
      return;
    }

    const skeleton = getSkeleton(features[0], coords);
    console.log(`clicked map feature (id=${features[0].id}): `, features[0]); // eslint-disable-line no-console
    publishDbgObject('last skeleton', skeleton);

    if (skeleton.nonOsmObject) {
      setFeature(coordsFeatureSetter(coords, map.getZoom()));
      return;
    }

    // router wouldnt overwrite the skeleton if same url is already loaded
    setFeature((feature) =>
      isSameOsmId(feature, skeleton) ? feature : skeleton,
    );
    setFeature(null);

    const result = await maptilerFix(features[0], skeleton, features[0].id);
    addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center); // for ways/relations we dont receive center from OSM API
    addFeatureCenterToCache(getShortId(result.osmMeta), skeleton.center);
    const url = `/${getUrlOsmId(result.osmMeta)}${window.location.hash}`;
    Router.push(url, undefined, { locale: 'default' });
  },
}));
