import type { OverpassOption } from '../types';

export const getOverpassOptions = (
  inputValue: string,
): [OverpassOption] | [] => {
  if (inputValue.match(/^(op|overpass):/)) {
    return [
      {
        overpass: {
          query: inputValue.replace(/^(op|overpass):/, ''),
          label: `custom query in this area`,
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
