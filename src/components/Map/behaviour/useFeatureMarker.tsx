import maplibregl, { Map } from 'maplibre-gl';
import { useEffect } from 'react';
import { createMapEffectHook } from '../../helpers';
import { convertOsmIdToMapId, layersWithOsmId } from '../helpers';
import { Feature } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useRouter } from 'next/router';
import { useUpdatePreviewMarker } from './previewMarkerWithArrow';

const FEATURE_MARKER = {
  color: '#eb5757',
  draggable: false,
};

const setPoiIconVisibility = (
  map: Map,
  feature: Feature | undefined,
  hideIcon: boolean,
) => {
  const style = map.getStyle();

  if (!feature || !style) return;

  const results = map.queryRenderedFeatures(undefined, {
    layers: layersWithOsmId(style),
    filter: ['==', ['id'], convertOsmIdToMapId(feature.osmMeta)],
    validate: false,
  });

  if (results.length) {
    map.setFeatureState(results[0], { hideIcon });
  }
};

const featureMarker = {} as { ref: maplibregl.Marker; feature: Feature };
const useUpdateFeatureMarker = createMapEffectHook<[Feature]>(
  (map, feature) => {
    if (featureMarker.ref) {
      featureMarker.ref.remove();
      setPoiIconVisibility(map, featureMarker.feature, false);
    }
    featureMarker.feature = feature;
    featureMarker.ref = undefined;

    if (feature?.center) {
      const [lng, lat] = feature.center;
      featureMarker.ref = new maplibregl.Marker(FEATURE_MARKER)
        .setLngLat([lng, lat])
        .addTo(map);
      setPoiIconVisibility(map, feature, true);
    }
  },
);

const isPanelOpen = (pathname: string, homepageShown: boolean) =>
  homepageShown || pathname !== '/';

export const useFeatureMarker = (map: Map) => {
  const { preview, feature, homepageShown } = useFeatureContext();
  const { pathname } = useRouter();
  const panelOpen = isPanelOpen(pathname, homepageShown);
  useUpdatePreviewMarker(map, preview, panelOpen);

  useUpdateFeatureMarker(map, feature);

  // hide the icon when tiles are fetched TODO sometimes broken (zoom problem)
  useEffect(() => {
    if (!map) {
      return;
    }
    const handle = setInterval(() => {
      if (map.areTilesLoaded()) {
        setPoiIconVisibility(map, feature, true);
        clearInterval(handle);
      }
    }, 200);
    // We want to run it only on Init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
};
