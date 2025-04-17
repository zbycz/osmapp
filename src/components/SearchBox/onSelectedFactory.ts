import { NextRouter } from 'next/router';
import { ShowToast } from '../utils/SnackbarContext';
import { overpassOptionSelected } from './options/overpass';
import { Bbox } from '../utils/MapStateContext';
import { Option } from './types';
import { osmOptionSelected } from './options/osm';
import { coordsOptionsSelected } from './options/coords';
import { geocoderOptionSelected } from './options/geocoder';
import { Feature } from '../../services/types';
import { starOptionSelected } from './options/stars';

type SetFeature = (feature: Feature | null) => void;

type OnSelectedFactoryProps = {
  setFeature: SetFeature;
  setPreview: SetFeature;
  bbox: Bbox;
  showToast: ShowToast;
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
};

export const onSelectedFactory =
  ({
    setFeature,
    setPreview,
    bbox,
    showToast,
    setOverpassLoading,
    router,
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
        geocoderOptionSelected(option, setFeature);
        break;
      case 'osm':
        osmOptionSelected(option, router);
        break;
      case 'coords':
        coordsOptionsSelected(option, setFeature);
    }
  };
