import { useEffect, useState } from 'react';
import { useMapStateContext } from '../utils/MapStateContext';
import { useStarsContext } from '../utils/StarsContext';
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

export const useGetOptions = (inputValue: string) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      const starOptions = getStarsOptions(stars, inputValue);

      if (inputValue === '') {
        setOptions(starOptions);
        return;
      }

      const coordOptions = getCoordsOption(inputValue);
      if (coordOptions.length) {
        setOptions(coordOptions);
        return;
      }

      const osmOptions = getOsmOptions(inputValue);
      if (osmOptions.length) {
        setOptions(osmOptions);
        return;
      }

      const overpassOptions = getOverpassOptions(inputValue);
      if (overpassOptions.length) {
        setOptions(overpassOptions);
        return;
      }

      const { before, after } = await getPresetOptions(inputValue);
      const beforeWithStars = [...starOptions, ...before];
      setOptions([...beforeWithStars, { type: 'loader' }]);

      fetchGeocoderOptions({
        inputValue,
        view,
        setOptions, // TODO refactor to await options instead of setOptions
        before: beforeWithStars,
        after,
      });
    })();
  }, [inputValue, stars]); // eslint-disable-line react-hooks/exhaustive-deps
  return options;
};
