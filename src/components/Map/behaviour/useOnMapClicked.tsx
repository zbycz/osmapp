import Router from 'next/router';
import { useAddMapEvent } from '../../helpers';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import {
  getShortId,
  getUrlOsmId,
  isSameOsmId,
} from '../../../services/helpers';
import { toDeg } from '../../../utils';
import { getCenter } from '../../../services/getCenter';
import { convertMapIdToOsmId, layersWithOsmId } from '../helpers';

export const getSkeleton = (feature, clickCoords) => {
  const isOsmObject = layersWithOsmId.includes(feature.layer.id);
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

const getCoordsSkeleton = (coords: number[]) => {
  const [lon, lat] = coords;
  return getSkeleton(
    {
      layer: { id: 'point' },
      properties: { name: toDeg(lat, lon), class: 'marker' },
    },
    coords,
  );
};

export const useOnMapClicked = useAddMapEvent(
  (map, setFeature, setPreview) => ({
    eventType: 'click',
    eventHandler: async (e) => {
      const { point } = e;
      const coords = map.unproject(point).toArray();
      const features = map.queryRenderedFeatures(point);
      if (!features.length) {
        setPreview(getCoordsSkeleton(coords));
        return;
      }

      const skeleton = getSkeleton(features[0], coords);
      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);
      console.log(`clicked map feature (id=${features[0].id}): `, skeleton); // eslint-disable-line no-console

      if (skeleton.nonOsmObject) {
        setPreview(skeleton);
        return;
      }

      // router wouldnt overwrite the skeleton if same url is already loaded
      setFeature((feature) =>
        isSameOsmId(feature, skeleton) ? feature : skeleton,
      );
      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

      Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
    },
  }),
);
