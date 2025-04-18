import { useEffect, useState } from 'react';
import { useMapStateContext, View } from '../utils/MapStateContext';
import { Star, useStarsContext } from '../utils/StarsContext';
import { abortFetch } from '../../services/fetch';
import {
  GEOCODER_ABORTABLE_QUEUE,
  fetchGeocoderOptions,
} from './options/geocoder';
import { getStarsOptions } from './options/stars';
import { getOverpassOptions } from './options/overpass';
import { getPresetOptions } from './options/preset';
import { Option } from './types';
import { getOsmOptions } from './options/osm';
import { getCoordsOption } from './options/coords';

const getMatchedOptions = (inputValue: string, stars: Star[]) => {
  if (inputValue === '') {
    const starOptions = getStarsOptions(stars, '');
    return starOptions;
  }

  const coordOptions = getCoordsOption(inputValue);
  if (coordOptions.length) {
    return coordOptions;
  }

  const osmOptions = getOsmOptions(inputValue);
  if (osmOptions.length) {
    return osmOptions;
  }

  const overpassOptions = getOverpassOptions(inputValue);
  if (overpassOptions.length) {
    return overpassOptions;
  }
};

const getSearchOptions = async (stars: Star[], inputValue: string) => {
  const starOptions = getStarsOptions(stars, inputValue);
  const { firstTwoPresets, restPresets } = await getPresetOptions(inputValue);
  const before = [...starOptions, ...firstTwoPresets];
  return { restPresets, before };
};

export const useGetOptions = (inputValue: string) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      const options = getMatchedOptions(inputValue, stars);
      if (options) {
        setOptions(options);
        return;
      }

      const { before, restPresets } = await getSearchOptions(stars, inputValue);
      setOptions([...before, { type: 'loader' }]);

      const geocoderOptions = await fetchGeocoderOptions(inputValue, view);
      if (geocoderOptions) {
        setOptions([...before, ...geocoderOptions, ...restPresets]);
      }
    })();

    // We don't want to re-send the request on change of View
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, stars]);

  return options;
};
