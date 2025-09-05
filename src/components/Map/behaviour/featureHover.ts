import {
  FeatureIdentifier,
  Map,
  MapGeoJSONFeature,
  MapMouseEvent,
  StyleSpecification,
} from 'maplibre-gl';

const HOVER_EXPRESSION = ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 1]; // prettier-ignore
const ICON_OPACITY = ['case', ['boolean', ['feature-state', 'hideIcon'], false], 0, HOVER_EXPRESSION]; // prettier-ignore

export const addHoverPaint = (origStyle): StyleSpecification => {
  origStyle.layers
    .filter((layer) => layer.id.match(/^poi-/))
    .forEach((layer) => {
      if (layer.paint) {
        layer.paint['icon-opacity'] = ICON_OPACITY; // eslint-disable-line no-param-reassign
      }
    });

  return origStyle;
};

export const setUpHover = (map: Map, layersWithOsmId: string[]) => {
  let lastHover = null;

  const setHoverOn = (feature: FeatureIdentifier | null) =>
    feature && map.setFeatureState(feature, { hover: true });
  const setHoverOff = (feature: FeatureIdentifier | null) =>
    feature && map.setFeatureState(feature, { hover: false });

  const onMouseMove = (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    } & Object,
  ) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      if (feature !== lastHover) {
        setHoverOff(lastHover);
        setHoverOn(feature);
        lastHover = feature;
        map.getCanvas().style.cursor = 'pointer'; // eslint-disable-line no-param-reassign
      }
    }
  };

  const onMouseLeave = () => {
    setHoverOff(lastHover);
    lastHover = null;
    // TODO delay 200ms
    map.getCanvas().style.cursor = ''; // eslint-disable-line no-param-reassign
  };

  layersWithOsmId.forEach((layer) => {
    map.on('mousemove', layer, onMouseMove);
    map.on('mouseleave', layer, onMouseLeave);
  });
};
