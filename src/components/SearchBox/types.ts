import { LonLat, Position } from '../../services/types';
//
// loading: true,
//   skeleton: true,
//   nonOsmObject: false,
//   osmMeta: { type, id },
// center: [parseFloat(lon), parseFloat(lat)],
//   tags: { name },
// properties: { class: option.class },

export type OptionGeocoder = {
  geocoder: {
    geometry: { coordinates: LonLat };
    properties: {
      osm_id: number;
      osm_type: string;
      name: string;
    };
  };
};

export type OverpassOption = {
  overpass: {
    query?: string;
    tags?: Record<string, string>;
    inputValue: string;
    label: string;
  };
};

export type PresetOption = {
  preset: {
    name: number;
    textsByOne: number[];
    sum: number;
    presetForSearch: {
      key: string;
      name: string;
      tags: Record<string, string>;
      tagsAsOneString: string;
      texts: string[];
    };
  };
};

// TODO not used anywhere yet, typescript cant identify options by the key (overpass, preset, loader)
export type SearchOption = OverpassOption | PresetOption;
