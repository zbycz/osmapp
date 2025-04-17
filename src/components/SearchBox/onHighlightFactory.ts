import { AutocompleteHighlightChangeReason } from '@mui/material';
import { Option } from './types';
import { getGeocoderSkeleton } from './options/geocoder';

export const onHighlightFactory =
  (setPreview: (feature: unknown) => void) =>
  (_: never, option: Option, reason: AutocompleteHighlightChangeReason) => {
    if (reason === 'touch') {
      return;
    }
    if (!option) {
      return;
    }
    if (option.type === 'star' && option.star.center) {
      const { center } = option.star;
      setPreview({ center });
      return;
    }
    if (option.type === 'coords') {
      const { center } = option.coords;
      setPreview({ center });
      return;
    }
    if (option.type === 'geocoder' && option.geocoder.geometry?.coordinates) {
      setPreview(getGeocoderSkeleton(option));
    }
  };
