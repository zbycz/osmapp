import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';
import { useMapEffect } from '../../helpers';
import { convertOsmIdToMapId, layersWithOsmId } from '../helpers';
import { Feature } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';

const MARKER_OPTIONS = {
  color: '#eb5757',
  draggable: false,
};

const setHideIcon = (map, feature, hideIcon) => {
  if (!feature) return;

  const results = map.queryRenderedFeatures(undefined, {
    layers: layersWithOsmId,
    filter: ['==', ['id'], convertOsmIdToMapId(feature.osmMeta)],
    validate: false,
  });

  if (results.length) {
    map.setFeatureState(results[0], { hideIcon });
  }
};

const marker = {} as { ref: maplibregl.Marker; feature: Feature };

const updateFeatureMarker = (map, feature) => {
  if (marker.feature === feature) {
    return;
  }

  if (marker.ref) {
    marker.ref.remove();
    setHideIcon(map, marker.feature, false);
  }
  marker.feature = feature;
  marker.ref = undefined;

  if (feature?.center) {
    marker.ref = new maplibregl.Marker(MARKER_OPTIONS)
      .setLngLat(feature.center)
      .addTo(map);
    setHideIcon(map, feature, true);
  }
};
const useUpdateFeatureMarker = useMapEffect(updateFeatureMarker);

export const useFeatureMarker = (map) => {
  const { feature } = useFeatureContext();
  useUpdateFeatureMarker(map, feature);

  // hide the icon when tiles are fetched
  useEffect(() => {
    if (map) {
      const handle = setInterval(() => {
        if (map.areTilesLoaded()) {
          setHideIcon(map, feature, true);
          clearInterval(handle);
        }
      }, 200);
    }
  }, [map]);
};
