/* eslint-disable no-param-reassign */
import type {
  DiffCommand,
  DiffOperationsMap,
  GeoJSONSource,
  Map,
} from 'maplibre-gl';
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language';
import cloneDeep from 'lodash/cloneDeep';
import {
  diff as styleDiff,
  type StyleSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import { createMapEffectHook } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { getRasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config.mjs';
import { makinaAfricaStyle } from '../styles/makinaAfricaStyle';
import {
  CLIMBING_SPRITE,
  climbingLayers,
} from '../styles/layers/climbingLayers';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { fetchCrags } from '../../../services/fetchCrags';
import { intl } from '../../../services/intl';
import { Layer } from '../../utils/MapStateContext';
import { setUpHover } from './featureHover';
import { isUrlForRasterLayer, layersWithOsmId } from '../helpers';
import { Theme } from '../../../helpers/theme';
import { addIndoorEqual, removeIndoorEqual } from './indoor';
import { addClimbingTilesSource } from '../climbingTiles/climbingTilesSource';
import { emptyStyle } from '../styles/emptyStyle';
import { ofrBasicStyle } from './ofrBasicStyle';
import { publishDbgObject } from '../../../utils';

const getBaseStyle = (key: string, currentTheme: Theme): StyleSpecification => {
  if (key === 'basic') {
    return basicStyle;
  }
  if (key === 'basicOfr') {
    return ofrBasicStyle;
  }
  if (key === 'makinaAfrica') {
    return makinaAfricaStyle;
  }
  if (key === 'outdoor') {
    return outdoorStyle;
  }

  const url = osmappLayers[key]?.url ?? key;
  if (isUrlForRasterLayer(url)) {
    return getRasterStyle(key, currentTheme);
  }

  return emptyStyle;
};

const addRasterOverlay = (
  style: StyleSpecification,
  overlayKey: string,
  currentTheme: Theme,
) => {
  const raster = getRasterStyle(overlayKey, currentTheme);
  style.sources[overlayKey] = raster.sources[overlayKey];
  style.layers.push(raster.layers[0]);
  // TODO maxzoom 19 only for snow overlay
};

const addClimbingOverlay = (style: StyleSpecification, map: Map) => {
  style.sources.climbing = EMPTY_GEOJSON_SOURCE;
  style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];

  fetchCrags().then(
    (geojson) => {
      const geojsonSource = map.getSource('climbing') as GeoJSONSource;
      geojsonSource?.setData(geojson); // TODO can be undefined at first map render
    },
    (error) => {
      console.warn('Climbing Layer failed to fetch.', error); // eslint-disable-line no-console
    },
  );
};

const addOverlaysToStyle = (
  map: Map,
  style: StyleSpecification,
  overlays: string[],
  currentTheme: Theme,
) => {
  // removeClimbingTilesSource(); // TODO call when climbing removed

  overlays
    .filter((key: string) => osmappLayers[key]?.type === 'overlay')
    .forEach((key: string) => {
      switch (key) {
        case 'climbing':
          if (process.env.NEXT_PUBLIC_ENABLE_CLIMBING_TILES) {
            addClimbingTilesSource(style);
          } else {
            addClimbingOverlay(style, map); // TODO remove this when climbingTiles are tested
          }
          break;

        case 'indoor':
          break; // indoorEqual must be added after setStyle()

        default:
          addRasterOverlay(style, key, currentTheme);
          break;
      }
    });
};

const isSourceAdded = (
  map: Map,
  change: DiffCommand<keyof DiffOperationsMap>,
) => {
  const sourceName = change.args[0] as string;
  return !!map.getSource(sourceName);
};

const updateStyleWithCustomDiff = (map: Map, style: StyleSpecification) => {
  const lastStyle = map.getStyle();
  const diff = styleDiff(lastStyle, style);

  const filteredDiff = diff.filter((change) => {
    const command = change.command;
    const commandFn = map[command];

    if (['removeSource', 'setGeoJSONSourceData'].includes(command)) {
      return;
    }

    if (command === 'addSource' && isSourceAdded(map, change)) {
      return;
    }

    if (!commandFn) {
      // TODO sentry semantical error
      console.warn(`Unexpected mapdiff change.command: ${command}`); // eslint-disable-line no-console
      return;
    }

    return true;
  });

  publishDbgObject('last mapDiff commands', filteredDiff);
  filteredDiff.forEach((change) => {
    map[change.command].call(map, ...change.args);
  });
};

export const useUpdateStyle = createMapEffectHook(
  (
    map,
    activeLayers: string[],
    userLayers: Layer[],
    mapLoaded: boolean,
    currentTheme: Theme,
  ) => {
    const [basemap, ...overlays] = activeLayers;
    const key = basemap ?? DEFAULT_MAP;

    const osmappLayerMaxZoom = osmappLayers[key]?.maxzoom;
    const userLayerMaxZoom = userLayers.find(({ url }) => url === key)?.maxzoom;
    map.setMaxZoom(osmappLayerMaxZoom ?? userLayerMaxZoom ?? 24); // TODO find a way how to zoom bing further (now it stops at 19)

    removeIndoorEqual();

    const osmappLayerMinZoom = osmappLayers[key]?.minzoom;
    const userLayerMinZoom = userLayers.find(({ url }) => url === key)?.minzoom;
    map.setMinZoom(osmappLayerMinZoom ?? userLayerMinZoom ?? 0);

    const style = cloneDeep(getBaseStyle(key, currentTheme));
    addOverlaysToStyle(map, style, overlays, currentTheme);
    style.projection = { type: 'globe' };

    // TODO refactor the {style,minZoom,maxZoom} to another pure function
    // TODO use that function to get initial style (once!)

    updateStyleWithCustomDiff(map, style);

    const languageControl = new OpenMapTilesLanguage({
      defaultLanguage: intl.lang,
    });
    map.addControl(languageControl);

    setUpHover(map, layersWithOsmId(style));

    if (mapLoaded && overlays.includes('indoor')) {
      addIndoorEqual();
    }
  },
);
