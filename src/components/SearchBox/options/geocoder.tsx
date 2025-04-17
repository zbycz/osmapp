import { Grid, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { join } from '../../../utils';
import {
  fitBounds,
  getHumanDistance,
  highlightText,
  IconPart,
  useMapCenter,
} from '../utils';
import { getPoiClass } from '../../../services/getPoiClass';
import { fetchJson } from '../../../services/fetch';
import { intl } from '../../../services/intl';
import {
  GeocoderOption,
  Option,
  PhotonGeojsonFeature,
  PhotonResponse,
} from '../types';
import { View } from '../../utils/MapStateContext';
import { PoiIcon } from '../../utils/icons/PoiIcon';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { Feature } from '../../../services/types';
import { addFeatureCenterToCache } from '../../../services/osm/featureCenterToCache';
import { getShortId, getUrlOsmId } from '../../../services/helpers';
import Router from 'next/router';

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
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }
      throw e;
    }
  },
  400,
);

const getAdditionalText = (props: PhotonGeojsonFeature['properties']) => {
  const address = [
    props.street,
    props.district,
    props.city,
    props.locality,
    props.county,
    props.state,
    props.countrycode,
  ]
    .filter((x) => x !== undefined)
    .filter((value, index, array) => array.indexOf(value) === index);
  return address.join(', ');
};

export const buildPhotonAddress = ({
  place,
  street,
  city,
  housenumber: hnum,
  streetnumber: snum,
}: PhotonGeojsonFeature['properties']) =>
  join(street ?? place ?? city, ' ', hnum ? hnum.replace(' ', '/') : snum);

type Props = {
  option: GeocoderOption;
  inputValue: string;
};

export const GeocoderRow = ({ option: { geocoder }, inputValue }: Props) => {
  const mapCenter = useMapCenter();
  const { isImperial } = useUserSettingsContext().userSettings;
  const { geometry, properties } = geocoder;
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

const getElementType = (osmType: string) => {
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
export const getGeocoderSkeleton = ({ geocoder }: GeocoderOption): Feature => {
  const center = geocoder.geometry.coordinates;
  const {
    osm_id: id,
    osm_type: osmType,
    osm_key: tagKey,
    osm_value: tagValue,
    name,
  } = geocoder.properties;
  const type = getElementType(osmType);

  return {
    type: 'Feature',
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id: parseInt(id, 10) },
    tags: { name },
    properties: getPoiClass({ [tagKey]: tagValue }),
    center,
  };
};

type SetFeature = (feature: Feature | null) => void;

export const geocoderOptionSelected = (
  option: GeocoderOption,
  setFeature: SetFeature,
) => {
  if (!option?.geocoder.geometry?.coordinates) return;

  const skeleton = getGeocoderSkeleton(option);
  console.log('Search item selected:', { option, skeleton }); // eslint-disable-line no-console

  addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

  setFeature(skeleton);
  fitBounds(option);
  Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
};
