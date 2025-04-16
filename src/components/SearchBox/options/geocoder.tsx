import { Grid, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { join } from '../../../utils';
import {
  getHumanDistance,
  highlightText,
  IconPart,
  useMapCenter,
} from '../utils';
import { getPoiClass } from '../../../services/getPoiClass';
import { fetchJson } from '../../../services/fetch';
import { intl } from '../../../services/intl';
import { Theme, useUserThemeContext } from '../../../helpers/theme';
import { GeocoderOption, Option } from '../types';
import { View } from '../../utils/MapStateContext';
import { LonLat } from '../../../services/types';
import { PoiIcon } from '../../utils/icons/PoiIcon';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';

const PHOTON_SUPPORTED_LANGS = ['en', 'de', 'fr'];
const DEFAULT = 'en'; // this was 'default' but it throws away some results, using 'en' was suggested https://github.com/zbycz/osmapp/issues/226

const getApiUrl = (inputValue: string, view: View) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(parseFloat(zoom))));
  const q = encodeURIComponent(inputValue);
  const lang = intl.lang in PHOTON_SUPPORTED_LANGS ? intl.lang : DEFAULT;
  return `https://photon.komoot.io/api/?q=${q}&lon=${lon}&lat=${lat}&zoom=${lvl}&lang=${lang}`;
};

export const GEOCODER_ABORTABLE_QUEUE = 'search';

let currentInput = '';
export const useInputValueState = () => {
  const [inputValue, setInputValue] = useState('');
  return {
    inputValue,
    setInputValue: useCallback((value: string) => {
      currentInput = value;
      setInputValue(value);
    }, []),
  };
};

type FetchGeocoderOptionsProps = {
  inputValue: string;
  view: View;
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  before: Option[];
  after: Option[];
};

type PhotonResponse = {
  features: GeocoderOption['geocoder'][];
};

export const fetchGeocoderOptions = debounce(
  async ({
    inputValue,
    view,
    setOptions,
    before,
    after,
  }: FetchGeocoderOptionsProps) => {
    try {
      const searchResponse = await fetchJson<PhotonResponse>(
        getApiUrl(inputValue, view),
        { abortableQueueName: GEOCODER_ABORTABLE_QUEUE },
      );

      // This blocks rendering of old result, when user already changed input
      if (inputValue !== currentInput) {
        return;
      }

      const options = searchResponse?.features || [];

      setOptions([
        ...before,
        ...options.map((feature) => ({
          type: 'geocoder' as const,
          geocoder: feature,
        })),
        ...after,
      ]);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        throw e;
      }
    }
  },
  400,
);

const getAdditionalText = (props) => {
  const address = [
    props.street,
    props.district,
    props.city,
    props.county,
    props.state,
    props.country,
  ].filter((x) => x !== undefined);
  return address.join(', ');
};

export const buildPhotonAddress = ({
  place,
  street,
  city,
  housenumber: hnum,
  streetnumber: snum,
}) => join(street ?? place ?? city, ' ', hnum ? hnum.replace(' ', '/') : snum);

type Props = {
  option: GeocoderOption;
  inputValue: string;
};

export const GeocoderRow = ({ option, inputValue }: Props) => {
  const mapCenter = useMapCenter();
  const { isImperial } = useUserSettingsContext().userSettings;
  const { geometry, properties } = option.geocoder;
  const { name, osm_key: tagKey, osm_value: tagValue } = properties;

  const distance = getHumanDistance(
    isImperial,
    mapCenter,
    geometry.coordinates,
  );
  const text = name || buildPhotonAddress(properties);
  const additionalText = getAdditionalText(properties);
  const poiClass = getPoiClass({ [tagKey]: tagValue });

  return (
    <>
      <IconPart>
        <PoiIcon
          ico={poiClass.class}
          title={`${tagKey}=${tagValue}`}
          size={20}
        />
        <div>{distance}</div>
      </IconPart>
      <Grid item xs>
        {highlightText(text, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {additionalText}
        </Typography>
      </Grid>
    </>
  );
};
