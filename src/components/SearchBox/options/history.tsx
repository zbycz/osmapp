import { Grid, Typography } from '@mui/material';
import Router from 'next/router';
import { getPoiClass } from '../../../services/getPoiClass';
import { LonLat } from '../../../services/types';
import Maki from '../../utils/Maki';
import { getSkeleton } from '../onHighlightFactory';
import { GeocoderOption, HistoryOption } from '../types';
import {
  diceCoefficientSort,
  getHumanDistance,
  highlightText,
  IconPart,
} from '../utils';
import { buildPhotonAddress, getAdditionalText } from './geocoder';
import { Theme } from '../../../helpers/theme';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import { getShortId, getUrlOsmId } from '../../../services/helpers';
import { SetFeature } from '../../utils/FeatureContext';

export const geocoderToHistory = (option: GeocoderOption): HistoryOption => {
  const { geocoder } = option;
  const { properties, geometry } = geocoder;
  const { coordinates } = geometry;

  const skeleton = getSkeleton(option);
  const { name, osm_key: tagKey, osm_value: tagValue } = properties;
  const { class: poiClass } = getPoiClass({ [tagKey]: tagValue });
  const additionalText = getAdditionalText(properties);

  return {
    type: 'history',
    history: {
      poiClass,
      additionalText,
      geometry: { coordinates },
      label: name || buildPhotonAddress(properties),
      osmMeta: skeleton.osmMeta,
    },
  };
};

export const getHistory = (
  options: HistoryOption[],
  inputValue: string,
): HistoryOption[] => {
  if (inputValue === '') {
    return options.slice(0, 5);
  }
  return diceCoefficientSort(
    options,
    ({ history: { label } }) => label,
    inputValue,
  );
};

export const renderHistory = (
  { history }: HistoryOption,
  currentTheme: Theme,
  inputValue: string,
  mapCenter: LonLat,
) => {
  const distance = getHumanDistance(mapCenter, history.geometry.coordinates);
  return (
    <>
      <IconPart>
        <Maki
          ico={history.poiClass}
          style={{ width: '20px', height: '20px', opacity: 0.5 }}
          invert={currentTheme === 'dark'}
        />
        <div>{distance}</div>
      </IconPart>
      <Grid item xs>
        {highlightText(history.label, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {history.additionalText}
        </Typography>
      </Grid>
    </>
  );
};

export const historyOptionSelected = (
  option: HistoryOption,
  setFeature: SetFeature,
) => {
  const { history } = option;
  const skeleton = getSkeleton(option);

  addFeatureCenterToCache(
    getShortId(history.osmMeta),
    history.geometry.coordinates,
  );

  setFeature(skeleton);

  Router.push(`/${getUrlOsmId(history.osmMeta)}`);
};
