import { AutocompleteHighlightChangeReason } from '@mui/material';
import { Option } from './types';
import { getGeocoderSkeleton } from './options/geocoder';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';

export const useGetOnHighlight = () => {
  const { setPreview } = useFeatureContext();

  return (
    _: never,
    option: Option,
    reason: AutocompleteHighlightChangeReason,
  ) => {
    if (reason === 'touch') {
      return;
    }
    if (!option) {
      return;
    }
    if (option.type === 'star' && option.star.center) {
      const { center } = option.star;
      setPreview({ center } as Feature); // TODO fix setPreview to accept only coordinates
      return;
    }
    if (option.type === 'coords') {
      const { center } = option.coords;
      setPreview({ center } as Feature); // TODO fix setPreview to accept only coordinates
      return;
    }
    if (option.type === 'geocoder' && option.geocoder.geometry?.coordinates) {
      setPreview(getGeocoderSkeleton(option));
    }
    if (option.type === 'climbing') {
      const { lat, lon } = option.climbing;
      setPreview({ center: [lon, lat] } as Feature); // TODO fix setPreview to accept only coordinates
    }
  };
};
