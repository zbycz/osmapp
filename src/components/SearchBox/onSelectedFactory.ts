import Router, { NextRouter } from 'next/router';
import { getApiId, getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';
import { getOverpassSource } from '../../services/mapStorage';
import { performOverpassSearch } from '../../services/overpassSearch';
import { t } from '../../services/intl';
import { fitBounds } from './utils';
import { getSkeleton } from './onHighlightFactory';
import { ShowToast } from '../utils/SnackbarContext';
import { addOverpassQueryHistory } from './options/overpass';
import { Feature } from '../../services/types';
import { Bbox } from '../utils/MapStateContext';
import {
  GeocoderOption,
  HistoryOption,
  Option,
  OverpassOption,
  PresetOption,
  StarOption,
} from './types';
import { osmOptionSelected } from './options/openstreetmap';
import { geocoderToHistory, historyOptionSelected } from './options/history';

const overpassOptionSelected = (
  option: OverpassOption | PresetOption,
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>,
  bbox: Bbox,
  showToast: ShowToast,
) => {
  const tagsOrQuery =
    option.type === 'preset'
      ? option.preset?.presetForSearch.tags
      : (option.overpass.tags ?? option.overpass.query);

  const timeout = setTimeout(() => {
    setOverpassLoading(true);
  }, 300);

  performOverpassSearch(bbox, tagsOrQuery)
    .then((geojson) => {
      const count = geojson.features.length;
      const content = t('searchbox.overpass_success', { count });
      showToast(content);
      getOverpassSource()?.setData(geojson);

      if (option.type === 'overpass') {
        addOverpassQueryHistory(option.overpass.query);
      }
    })
    .catch((e) => {
      const message = `${e}`.substring(0, 100);
      const content = t('searchbox.overpass_error', { message });
      console.error(e); // eslint-disable-line no-console
      showToast(content, 'error');
    })
    .finally(() => {
      clearTimeout(timeout);
      setOverpassLoading(false);
    });
};

const starOptionSelected = ({ star }: StarOption) => {
  const apiId = getApiId(star.shortId);
  Router.push(`/${getUrlOsmId(apiId)}`);
};

type SetFeature = (feature: Feature | null) => void;

const geocoderOptionSelected = (
  option: GeocoderOption,
  setFeature: SetFeature,
  addToHistoryOption: (option: HistoryOption) => void,
) => {
  if (!option?.geocoder.geometry?.coordinates) return;

  const skeleton = getSkeleton(option);
  console.log('Search item selected:', { location: option, skeleton }); // eslint-disable-line no-console

  addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

  setFeature(skeleton);
  fitBounds(option);
  Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);

  addToHistoryOption(geocoderToHistory(option));
};

type OnSelectedFactoryProps = {
  setFeature: SetFeature;
  setPreview: SetFeature;
  bbox: Bbox;
  showToast: ShowToast;
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
  addToHistoryOption: (option: HistoryOption) => void;
};

export const onSelectedFactory =
  ({
    setFeature,
    setPreview,
    bbox,
    showToast,
    setOverpassLoading,
    router,
    addToHistoryOption,
  }: OnSelectedFactoryProps) =>
  (_: never, option: Option) => {
    setPreview(null); // it could be stuck from onHighlight

    switch (option.type) {
      case 'star':
        starOptionSelected(option);
        break;
      case 'overpass':
      case 'preset':
        overpassOptionSelected(option, setOverpassLoading, bbox, showToast);
        break;
      case 'geocoder':
        geocoderOptionSelected(option, setFeature, addToHistoryOption);
        break;
      case 'osm':
        osmOptionSelected(option, router);
        break;
      case 'history':
        historyOptionSelected(option, setFeature);
        break;
    }
  };
