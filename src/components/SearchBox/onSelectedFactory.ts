import Router from 'next/router';
import { getApiId, getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';
import { getGlobalMap } from '../../services/mapStorage';
import { performOverpassSearch } from '../../services/overpassSearch';
import { t } from '../../services/intl';
import { fitBounds } from './utils';
import { getSkeleton } from './onHighlightFactory';

const overpassOptionSelected = (
  option,
  setOverpassLoading,
  bbox,
  showToast,
) => {
  const tagsOrQuery =
    option.preset?.presetForSearch.tags ??
    option.overpass.tags ??
    option.overpass.query;

  const timeout = setTimeout(() => {
    setOverpassLoading(true);
  }, 300);

  performOverpassSearch(bbox, tagsOrQuery)
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
};

const starOptionSelected = (option) => {
  const apiId = getApiId(option.star.shortId);
  Router.push(`/${getUrlOsmId(apiId)}`);
};

const geocoderOptionSelected = (option, setFeature) => {
  if (!option?.geometry?.coordinates) return;

  const skeleton = getSkeleton(option);
  console.log('Search item selected:', { location: option, skeleton }); // eslint-disable-line no-console

  addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

  setFeature(skeleton);
  fitBounds(option, true);
  Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
};

export const onSelectedFactory =
  (setFeature, setPreview, bbox, showToast, setOverpassLoading) =>
  (_, option) => {
    setPreview(null); // it could be stuck from onHighlight

    if (option.star) {
      starOptionSelected(option);
      return;
    }

    if (option.overpass || option.preset) {
      overpassOptionSelected(option, setOverpassLoading, bbox, showToast);
      return;
    }

    geocoderOptionSelected(option, setFeature);
  };
