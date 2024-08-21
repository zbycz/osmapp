import { createMapEventHook, isMobileDevice } from '../../helpers';
import pickBy from 'lodash/pickBy';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import { getOsmappLink, getShortId } from '../../../services/helpers';
import {
  getRoundedPosition,
  publishDbgObject,
  roundedToDeg,
} from '../../../utils';
import { getCenter } from '../../../services/getCenter';
import { convertMapIdToOsmId, getIsOsmObject } from '../helpers';
import { maptilerFix } from './maptilerFix';
import { Feature, LonLat, OsmId } from '../../../services/types';
import { createCoordsFeature, pushFeatureToRouter } from './utils';
import { SetFeature } from '../../utils/FeatureContext';
import maplibregl, { Map, MapGeoJSONFeature } from 'maplibre-gl';
import type { MapClickOverrideRef } from '../../utils/MapStateContext';

const isSameOsmId = (feature: Feature, skeleton: Feature) =>
  feature && skeleton && getOsmappLink(feature) === getOsmappLink(skeleton);

const getIndoorEqualId = (feature: Feature): OsmId | null => {
  if (feature.layer.id?.startsWith('indoor-') && feature.properties.id) {
    const [type, id] = `${feature.properties.id}`.split(':');
    return { type, id: parseInt(id, 10) } as OsmId;
  }
  return null;
};

const getId = (feature) => {
  const indoorId = getIndoorEqualId(feature);
  if (indoorId) {
    return { isOsmObject: true, osmMeta: indoorId };
  }

  const isOsmObject = getIsOsmObject(feature);
  const osmMeta = isOsmObject
    ? convertMapIdToOsmId(feature)
    : { type: feature.layer.id, id: feature.id };
  return { isOsmObject, osmMeta };
};

const getOnlyLabel = (
  features: MapGeoJSONFeature[],
  coords: LonLat,
  map: maplibregl.Map,
) => {
  const getCoordsName = () => {
    return roundedToDeg(getRoundedPosition(coords, map.getZoom()));
  };

  if (!features.length) {
    return getCoordsName();
  }

  const skeleton = getSkeleton(features[0], coords);
  if (skeleton.nonOsmObject) {
    return getCoordsName();
  }

  return features[0]?.properties?.name ?? getCoordsName();
};

export const getSkeleton = (
  feature /* TODO MapGeoJSONFeature*/,
  clickCoords: LonLat,
) => {
    const { isOsmObject, osmMeta } = getId(feature);

  const nameTags = pickBy(feature.properties, (_, key) =>
    key.startsWith('name'),
  );
  return {
    ...feature,
    geometry: feature.geometry,
    center: getCenter(feature.geometry) || clickCoords,
    osmMeta,
    tags: nameTags,
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

export const useOnMapClicked = createMapEventHook<
  'click',
  [SetFeature, MapClickOverrideRef]
>((map, setFeature, mapClickOverrideRef) => ({
  eventType: 'click',
  eventHandler: async ({ point }) => {
    const coords = map.unproject(point).toArray();
    const features = map.queryRenderedFeatures(point);

    if (mapClickOverrideRef.current) {
      const label = getOnlyLabel(features, coords, map);
      mapClickOverrideRef.current(coords, label);
      return;
    }

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
}));
