import Router from 'next/router';
import maplibregl from 'maplibre-gl';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';
import { getGlobalMap } from '../../services/mapStorage';
import { performOverpassSearch } from '../../services/overpassSearch';
import { t } from '../../services/intl';

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

export const onHighlightFactory = (setPreview) => (e, location) => {
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

export const onSelectedFactory =
  (setFeature, setPreview, mobileMode, bbox, showToast, setOverpassLoading) =>
  (_, option) => {
    if (option.overpass || option.preset) {
      const tags = option.overpass || option.preset.presetForSearch.tags;

      const timeout = setTimeout(() => {
        setOverpassLoading(true);
      }, 300);

      // change url to /category, fetching will be done there
      console.log(option.preset.presetForSearch, 'asdf'); // eslint-disable-line no-console
      Router.push(`/category/${option.preset.presetForSearch.key}`);

      performOverpassSearch(bbox, tags)
        .then((geojson) => {
          const count = geojson.features.length;
          const content = t('searchbox.overpass_success', { count });
          showToast({ content });
          getGlobalMap().getSource('overpass')?.setData(geojson);
        })
        .catch((e) => {
          const message = `${e}`.substring(0, 100);
          const content = t('searchbox.overpass_error', { message });
          showToast({ content, type: 'error' });
        })
        .finally(() => {
          clearTimeout(timeout);
          setOverpassLoading(false);
        });
      return;
    }
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
