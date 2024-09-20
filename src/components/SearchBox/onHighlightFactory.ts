import { Feature } from '../../services/types';
import { GeocoderOption, Option } from './types';

const getElementType = (osmType: string) => {
  switch (osmType) {
    case 'R':
      return 'relation';
    case 'W':
      return 'way';
    case 'N':
      return 'node';
    default:
      throw new Error(`Geocoder osm_id is invalid: ${osmType}`);
  }
};

export const getSkeleton = ({ geocoder }: GeocoderOption): Feature => {
  const center = geocoder.geometry.coordinates;
  const { osm_id: id, osm_type: osmType, name } = geocoder.properties;
  const type = getElementType(osmType);

  return {
    center,
    type: 'Feature',
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id: parseInt(id, 10) },
    tags: { name },
    properties: { class: geocoder.properties.class, subclass: '' },
  };
};

export const onHighlightFactory =
  (setPreview: (feature: unknown) => void) => (_: never, option: Option) => {
    if (!option) return;
    if (option.type === 'star' && option.star.center) {
      const { center } = option.star;
      setPreview({ center });
      return;
    }

    if (option.type === 'geocoder' && option.geocoder.geometry?.coordinates) {
      setPreview(getSkeleton(option));
    }
  };
