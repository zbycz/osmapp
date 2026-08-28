import type {
  LayerSpecification,
  StyleSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import { Theme } from '../../../helpers/theme';
import { overpassLayers } from './layers/overpassLayers';
import { EMPTY_GEOJSON_SOURCE } from '../consts';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_THUNDERFOREST;

export const getThunderforestTransportStyleUrl = (theme: Theme): string =>
  theme === 'dark'
    ? `https://tile.thunderforest.com/thunderforest.transport-dark-v2/style.json?apikey=${API_KEY}`
    : `https://tile.thunderforest.com/thunderforest.transport-v2/style.json?apikey=${API_KEY}`;

// Sources that belong to Thunderforest transport tiles – populated when the style is fetched.
// Used by convertMapIdToOsmId to recognise features from these tiles.
export const thunderforestTransportSources = new Set<string>();

// Symbol or circle layers that have an icon (not just text labels) and a source-layer are
// considered clickable POI / transit-stop features.
const isClickableLayer = (layer: LayerSpecification): boolean => {
  if (!(layer as any)['source-layer']) return false;
  if (layer.type === 'circle') return true;
  if (layer.type === 'symbol') {
    const layout = (layer as any).layout ?? {};
    return !!layout['icon-image'];
  }
  return false;
};

const markClickableLayers = (
  style: StyleSpecification,
): StyleSpecification => ({
  ...style,
  layers: style.layers.map((layer) =>
    isClickableLayer(layer)
      ? {
          ...layer,
          metadata: {
            ...(typeof layer.metadata === 'object' ? layer.metadata : {}),
            clickableWithOsmId: true,
          },
        }
      : layer,
  ),
});

const addOverpassSupport = (
  style: StyleSpecification,
): StyleSpecification => ({
  ...style,
  sources: {
    ...style.sources,
    overpass: EMPTY_GEOJSON_SOURCE,
  },
  layers: [...style.layers, ...overpassLayers],
});

const registerThunderforestSources = (style: StyleSpecification): void => {
  style.layers.forEach((layer) => {
    if (isClickableLayer(layer)) {
      const src = (layer as any).source as string | undefined;
      if (src) thunderforestTransportSources.add(src);
    }
  });
};

const processStyle = (style: StyleSpecification): StyleSpecification => {
  registerThunderforestSources(style);
  return addOverpassSupport(markClickableLayers(style));
};

const styleCache: Partial<Record<string, StyleSpecification>> = {};

export const fetchTransportVectorStyle = async (
  theme: Theme,
): Promise<StyleSpecification> => {
  const url = getThunderforestTransportStyleUrl(theme);
  if (styleCache[url]) {
    return styleCache[url]!;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch transport vector style: ${response.status}`,
    );
  }

  const style = (await response.json()) as StyleSpecification;
  const processed = processStyle(style);
  styleCache[url] = processed;
  return processed;
};
