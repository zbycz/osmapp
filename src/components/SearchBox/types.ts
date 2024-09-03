// TODO export type OptionGeocoder = {
//   loading: true;
//   skeleton: true;
//   nonOsmObject: true;
//   osmMeta: { type: string; id: number };
//   center: LonLat;
//   tags: Record<string, string>;
//   properties: { class: string }; // ?? is really used
// };

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
