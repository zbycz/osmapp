import Router from 'next/router';
import maplibregl from 'maplibre-gl';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';
import { getGlobalMap } from '../../services/mapStorage';

const getApiIdFromLocation = (osmId) => {
  if (osmId.startsWith('relation')) {
    return { type: 'relation', id: osmId.substr(8) };
  }
  if (osmId.startsWith('way')) {
    return { type: 'way', id: osmId.substr(3) };
  }
  if (osmId.startsWith('node')) {
    return { type: 'node', id: osmId.substr(4) };
  }
  throw new Error(`Maptiler geocoder osm_id is invalid: ${osmId}`);
};

const getSkeleton = (location) => {
  const { properties, place_name: name, center } = location;
  const { osm_id: osmId } = properties;
  const { type, id } = getApiIdFromLocation(osmId);
  const [lon, lat] = center;

  return {
    loading: true,
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name },
    properties: { class: location.class },
  };
};

export const onHighlightFactory = (setPreview) => (e, location) => {
  if (!location?.lat) return;
  setPreview({ ...getSkeleton(location), noPreviewButton: true });
};

const fitBounds = (location, panelShown = false) => {
  const [w, s, e, n] = location.bbox;
  const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
  const panelWidth = panelShown ? 410 : 0;
  getGlobalMap()?.fitBounds(bbox, {
    padding: { top: 5, bottom: 5, right: 5, left: panelWidth + 5 },
  });
};

export const onSelectedFactory =
  (setFeature, setPreview, setView, mobileMode) => (e, location) => {
    if (!location?.center) return;

    const skeleton = getSkeleton(location);
    console.log('Search item selected:', { location, skeleton }); // eslint-disable-line no-console

    addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

    if (mobileMode) {
      setPreview(skeleton);
      fitBounds(location);
      return;
    }

    setPreview(null);
    setFeature(skeleton);
    fitBounds(location, true);
    Router.push(`/${getUrlOsmId(skeleton.osmMeta)}${window.location.hash}`);
  };
