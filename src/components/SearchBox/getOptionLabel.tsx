import { Option } from './types';
import { buildPhotonAddress } from './options/geocoder';

// This is what is showin in the <input> after users selects the Option
export const getOptionLabel = (option: Option | undefined) => {
  if (option == null) {
    return '';
  }

  return (
    (option.type === 'geocoder' && option.geocoder.properties?.name) ||
    (option.type === 'preset' && option.preset?.presetForSearch?.name) ||
    (option.type === 'overpass' && option.overpass?.inputValue) ||
    (option.type === 'star' && option.star.label) ||
    (option.type === 'coords' && option.coords.label) ||
    (option.type === 'loader' && '') ||
    (option.type === 'geocoder' &&
      option.geocoder.properties &&
      buildPhotonAddress(option.geocoder.properties)) ||
    (option.type === 'osm' && `${option.osm.type}/${option.osm.id}`) ||
    ''
  );
};
