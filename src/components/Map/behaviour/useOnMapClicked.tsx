import { createMapEventHook, isMobileDevice } from '../../helpers';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import { getOsmappLink, getShortId } from '../../../services/helpers';
import { publishDbgObject } from '../../../utils';
import { getCenter } from '../../../services/getCenter';
import { convertMapIdToOsmId, getIsOsmObject } from '../helpers';
import { maptilerFix } from './maptilerFix';
import { Feature, LonLat } from '../../../services/types';
import { createCoordsFeature, pushFeatureToRouter } from './utils';
import { SetFeature } from '../../utils/FeatureContext';
import { Map } from 'maplibre-gl';

const isSameOsmId = (feature: Feature, skeleton: Feature) =>
  feature && skeleton && getOsmappLink(feature) === getOsmappLink(skeleton);

export const getSkeleton = (feature, clickCoords: LonLat) => {
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

const coordsClicked = (map: Map, coords: LonLat, setFeature: SetFeature) => {
  if (isMobileDevice()) {
    setFeature(null); // handled by useOnMapLongPressed
    pushFeatureToRouter(null);
    return;
  }

  setFeature((previousFeature) => {
    if (previousFeature) {
      pushFeatureToRouter(null);
      return null;
    }
    const coordsFeature = createCoordsFeature(coords, map);
    pushFeatureToRouter(coordsFeature);
    return coordsFeature;
  });
};

export const useOnMapClicked = createMapEventHook<'click', [SetFeature]>(
  (map, setFeature) => ({
    eventType: 'click',
    eventHandler: async ({ point }) => {
      const coords = map.unproject(point).toArray();
      const features = map.queryRenderedFeatures(point);
      if (!features.length) {
        coordsClicked(map, coords, setFeature);
        return;
      }

      const skeleton = getSkeleton(features[0], coords);
      console.log(`clicked map feature (id=${features[0].id}): `, features[0]); // eslint-disable-line no-console
      publishDbgObject('last skeleton', skeleton);

      if (skeleton.nonOsmObject) {
        coordsClicked(map, coords, setFeature);
        return;
      }

      // router wouldnt overwrite the skeleton if same url is already loaded
      setFeature((feature) =>
        isSameOsmId(feature, skeleton) ? feature : skeleton,
      );

      const result = await maptilerFix(features[0], skeleton, features[0].id);
      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center); // for ways/relations we dont receive center from OSM API
      addFeatureCenterToCache(getShortId(result.osmMeta), skeleton.center);
      pushFeatureToRouter(result);
    },
  }),
);
