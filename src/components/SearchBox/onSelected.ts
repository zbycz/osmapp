import Router from 'next/router';
import maplibregl from 'maplibre-gl';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';
import { getGlobalMap } from '../../services/mapStorage';

const getElementType = (osmType) => {
  switch (osmType) {
    case 'R':
      return 'relation';
    case 'W':
      return 'way';
    case 'N':
      return 'node';
    default:
      throw new Error(`Geocoder osm_id is invalid: ${osmType}`);
  }
};

const getSkeleton = (option) => {
  const center = option.geometry.coordinates;
  const { osm_id: id, osm_type: osmType, name } = option.properties;
  const type = getElementType(osmType);
  const [lon, lat] = center;

  return {
    loading: true,
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name },
    properties: { class: option.class },
  };
};

export const onHighlightFactory = (setPreview, location) => {
  if (!location?.lat) return;
  setPreview({ ...getSkeleton(location), noPreviewButton: true });
};

const fitBounds = (option, panelShown = false) => {
  if (!option.properties.extent) {
    const coords = option.geometry.coordinates;
    getGlobalMap()?.flyTo({ center: coords, zoom: 17 });
  } else {
    const [w, s, e, n] = option.properties.extent;
    const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
    const panelWidth = panelShown ? 410 : 0;
    getGlobalMap()?.fitBounds(bbox, {
      padding: { top: 5, bottom: 5, right: 5, left: panelWidth + 5 },
    });
  }
};

export const onSelected = (setFeature, setPreview, mobileMode, option) => {
  if (!option?.geometry.coordinates) return;

  const skeleton = getSkeleton(option);
  console.log('Search item selected:', { location: option, skeleton }); // eslint-disable-line no-console

  addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

  if (mobileMode) {
    setPreview(skeleton);
    fitBounds(option);
    return;
  }

  setPreview(null);
  setFeature(skeleton);
  fitBounds(option, true);
  Router.push(`/${getUrlOsmId(skeleton.osmMeta)}${window.location.hash}`);
};
