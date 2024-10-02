import { AutocompleteHighlightChangeReason } from '@mui/material';
import { Feature } from '../../services/types';
import { GeocoderOption, HistoryOption, Option } from './types';

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

export const getSkeleton = (
  option: GeocoderOption | HistoryOption,
): Feature => {
  if (option.type === 'history') {
    const { history } = option;
    return {
      center: history.geometry.coordinates,
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: history.osmMeta,
      tags: { name: history.label },
      properties: { class: '', subclass: '' },
    };
  }

  const { geocoder } = option;
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
  (setPreview: (feature: unknown) => void) =>
  (_: never, option: Option, reason: AutocompleteHighlightChangeReason) => {
    if (reason === 'touch') return;
    if (!option) return;
    if (option.type === 'star' && option.star.center) {
      const { center } = option.star;
      setPreview({ center });
      return;
    }

    if (option.type === 'geocoder' && option.geocoder.geometry?.coordinates) {
      setPreview(getSkeleton(option));
    }
    if (option.type === 'history') {
      setPreview(getSkeleton(option));
    }
  };
