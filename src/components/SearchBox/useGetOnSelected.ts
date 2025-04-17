import { NextRouter, useRouter } from 'next/router';
import { ShowToast, useSnackbar } from '../utils/SnackbarContext';
import { overpassOptionSelected } from './options/overpass';
import { Bbox, useMapStateContext } from '../utils/MapStateContext';
import { Option } from './types';
import { osmOptionSelected } from './options/osm';
import { coordsOptionsSelected } from './options/coords';
import { geocoderOptionSelected, useInputValueState } from './options/geocoder';
import { Feature } from '../../services/types';
import { starOptionSelected } from './options/stars';
import { useFeatureContext } from '../utils/FeatureContext';
import { useGetOptions } from './useGetOptions';
import { Setter } from '../../types';

type SetFeature = (feature: Feature | null) => void;

type OnSelectedFactoryProps = {
  setFeature: SetFeature;
  setPreview: SetFeature;
  bbox: Bbox;
  showToast: ShowToast;
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
};

export const useGetOnSelected = (setOverpassLoading: Setter<boolean>) => {
  const { setFeature, setPreview } = useFeatureContext();
  const { bbox } = useMapStateContext();
  const { showToast } = useSnackbar();

  return (_: never, option: Option) => {
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
      case 'osm':
        osmOptionSelected(option);
        break;
      case 'coords':
        coordsOptionsSelected(option, setFeature);
    }
  };
};
