import type { OverpassOption } from '../types';
import { t } from '../../../services/intl';

export const getOverpassOptions = (
  inputValue: string,
): [OverpassOption] | [] => {
  if (inputValue.match(/^(op|overpass):/)) {
    return [
      {
        overpass: {
          query: inputValue.replace(/^(op|overpass):/, ''),
          label: t('searchbox.overpass_custom_query'),
          inputValue,
        },
      },
    ];
  }

  if (inputValue.match(/^[-:_a-zA-Z0-9]+=/)) {
    const [key, value] = inputValue.split('=', 2);
    return [
      {
        overpass: {
          tags: { [key]: value || '*' },
          label: `${key}=${value || '*'}`,
          inputValue,
        },
      },
    ];
  }

  return [];
};
