import { useSnackbar } from '../utils/SnackbarContext';
import { overpassOptionSelected } from './options/overpass';
import { useMapStateContext } from '../utils/MapStateContext';
import { Option } from './types';
import { osmOptionSelected } from './options/osm';
import { coordsOptionsSelected } from './options/coords';
import { geocoderOptionSelected } from './options/geocoder';
import { starOptionSelected } from './options/stars';
import { useFeatureContext } from '../utils/FeatureContext';
import { Setter } from '../../types';
import { useCallback } from 'react';
import { climbingOptionSelected } from './options/climbing';

export const useGetOnSelected = (setOverpassLoading: Setter<boolean>) => {
  const { setFeature, setPreview } = useFeatureContext();
  const { bbox } = useMapStateContext();
  const { showToast } = useSnackbar();

  return useCallback(
    (_: null, option: Option) => {
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
          geocoderOptionSelected(option, setFeature);
          break;
        case 'climbing':
          climbingOptionSelected(option);
          break;
        case 'osm':
          osmOptionSelected(option);
          break;
        case 'coords':
          coordsOptionsSelected(option, setFeature);
      }
    },
    [bbox, setFeature, setOverpassLoading, setPreview, showToast],
  );
};
