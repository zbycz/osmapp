import { Grid, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { join } from '../../../utils';
import { getKmDistance, highlightText, IconPart } from '../utils';
import { getPoiClass } from '../../../services/getPoiClass';
import Maki from '../../utils/Maki';
import { fetchJson } from '../../../services/fetch';
import { intl } from '../../../services/intl';

const PHOTON_SUPPORTED_LANGS = ['en', 'de', 'fr'];

const getApiUrl = (inputValue, view) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(zoom)));
  const q = encodeURIComponent(inputValue);
  const lang = intl.lang in PHOTON_SUPPORTED_LANGS ? intl.lang : 'default';
  return `https://photon.komoot.io/api/?q=${q}&lon=${lon}&lat=${lat}&zoom=${lvl}&lang=${lang}`;
};

export const GEOCODER_ABORTABLE_QUEUE = 'search';

let currentInput = '';
export const useInputValueState = () => {
  const [inputValue, setInputValue] = useState('');
  return {
    inputValue,
    setInputValue: useCallback((value) => {
      currentInput = value;
      setInputValue(value);
    }, []),
  };
};

export const fetchGeocoderOptions = debounce(
  async (inputValue, view, setOptions, before, after) => {
    try {
      const searchResponse = await fetchJson(getApiUrl(inputValue, view), {
        abortableQueueName: GEOCODER_ABORTABLE_QUEUE,
      });

      // This blocks rendering of old result, when user already changed input
      if (inputValue !== currentInput) {
        return;
      }

      const options = searchResponse?.features || [];

      setOptions([...before, ...options, ...after]);
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

/** photon
 [
 {
    geometry: {
      coordinates: [16.5920871, 49.2416882],
      type: 'Point',
    },
    type: 'Feature',
    properties: {
      osm_id: 2493045013,
      country: 'Česko',
      city: 'Brno',
      countrycode: 'CZ',
      postcode: '612 00',
      county: 'Jihomoravský kraj',
      type: 'house',
      osm_type: 'N',
      osm_key: 'leisure',
      street: 'Podhájí',
      district: 'Řečkovice',
      osm_value: 'sports_centre',
      name: 'VSK MENDELU',
      state: 'Jihovýchod',
    },
  },
 // housenumber
 {
    geometry: { coordinates: [14.4036424, 50.098012], type: 'Point' },
    type: 'Feature',
    properties: {
      osm_id: 296816783,
      country: 'Czechia',
      city: 'Prague',
      countrycode: 'CZ',
      postcode: '16000',
      type: 'house',
      osm_type: 'N',
      osm_key: 'place',
      housenumber: '8',
      street: 'Dejvická',
      district: 'Dejvice',
      osm_value: 'house',
      state: 'Prague',
    },
  },
 ];
 */
export const renderGeocoder = (option, currentTheme, inputValue, mapCenter) => {
  const { geometry, properties } = option;
  const { name, osm_key: tagKey, osm_value: tagValue } = properties;

  const distKm = getKmDistance(mapCenter, geometry.coordinates);
  const text = name || buildPhotonAddress(properties);
  const additionalText = getAdditionalText(properties);
  const poiClass = getPoiClass({ [tagKey]: tagValue });

  return (
    <>
      <IconPart>
        <Maki
          ico={poiClass.class}
          style={{ width: '20px', height: '20px', opacity: 0.5 }}
          title={`${tagKey}=${tagValue}`}
          invert={currentTheme === 'dark'}
        />
        <div>{distKm} km</div>
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
