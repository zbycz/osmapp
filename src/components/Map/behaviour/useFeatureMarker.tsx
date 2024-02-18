import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';
import { useMapEffect } from '../../helpers';
import { convertOsmIdToMapId, layersWithOsmId } from '../helpers';
import { Feature } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';

const FEATURE_MARKER = {
  color: '#eb5757',
  draggable: false,
};

const PREVIEW_MARKER = {
  color: '#556cd6',
  draggable: false,
};

const setPoiIconVisibility = (map, feature, hideIcon) => {
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

const featureMarker = {} as { ref: maplibregl.Marker; feature: Feature };
const useUpdateFeatureMarker = useMapEffect((map, feature) => {
  if (featureMarker.ref) {
    featureMarker.ref.remove();
    setPoiIconVisibility(map, featureMarker.feature, false);
  }
  featureMarker.feature = feature;
  featureMarker.ref = undefined;

  if (feature?.center) {
    featureMarker.ref = new maplibregl.Marker(FEATURE_MARKER)
      .setLngLat(feature.center)
      .addTo(map);
    setPoiIconVisibility(map, feature, true);
  }
});

let previewMarker: maplibregl.Marker;
const useUpdatePreviewMarker = useMapEffect((map, feature) => {
  previewMarker?.remove();
  previewMarker = feature?.center
    ? new maplibregl.Marker(PREVIEW_MARKER).setLngLat(feature.center).addTo(map)
    : undefined;
});

export const useFeatureMarker = (map) => {
  const { preview, feature } = useFeatureContext();
  useUpdateFeatureMarker(map, feature);
  useUpdatePreviewMarker(map, preview);

  // hide the icon when tiles are fetched TODO sometimes broken (zoom problem) (also maybe causes webgl blackout)
  useEffect(() => {
    if (map) {
      const handle = setInterval(() => {
        if (map.areTilesLoaded()) {
          setPoiIconVisibility(map, feature, true);
          clearInterval(handle);
        }
      }, 200);
    }
  }, [map]);
};
