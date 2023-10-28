import Router from 'next/router';
import { useAddMapEvent } from '../../helpers';
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

export const useOnMapClicked = useAddMapEvent(
  (map, setFeature, setPreview, mobileMode) => ({
    eventType: 'click',
    eventHandler: async ({ point }) => {
      const coords = map.unproject(point).toArray();
      const features = map.queryRenderedFeatures(point);
      if (!features.length) {
        const roundedPosition = getRoundedPosition(coords, map.getZoom());
        setPreview(getCoordsFeature(roundedPosition));
        return;
      }

      const skeleton = getSkeleton(features[0], coords);
      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center); // for ways/relations we dont receive center from OSM API
      console.log(`clicked map feature (id=${features[0].id}): `, features[0]); // eslint-disable-line no-console
      publishDbgObject('last skeleton', skeleton);

      if (skeleton.nonOsmObject) {
        const roundedPosition = getRoundedPosition(coords, map.getZoom());
        setPreview(getCoordsFeature(roundedPosition));
        return;
      }

      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

      if (mobileMode) {
        setPreview(skeleton);
        return;
      }

      // router wouldnt overwrite the skeleton if same url is already loaded
      setFeature((feature) =>
        isSameOsmId(feature, skeleton) ? feature : skeleton,
      );
      setPreview(null);

      Router.push(`/${getUrlOsmId(skeleton.osmMeta)}${window.location.hash}`);
    },
  }),
);
