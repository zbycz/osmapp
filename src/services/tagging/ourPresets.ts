import { RawPresets } from './types/Presets';

export const ourFields = {
  'climbing/length': {
    key: 'climbing:length',
    type: 'number',
    minValue: 0,
    label: 'Length (m)',
  },
  'climbing/bolts': {
    key: 'climbing:bolts',
    type: 'number',
    minValue: 0,
    label: 'Bolts',
  },
  'climbing/rock': {
    key: 'climbing:rock',
    type: 'combo',
    label: 'Rock type',
  },

  'climbing/grade': {
    keys: [
      'climbing:grade:uiaa', // plus :min :max :mean variants ???
      'climbing:grade:french',
      'climbing:grade:saxon',
      'climbing:grade:aid',
      'climbing:grade:hueco',
      'climbing:grade:yds_class',
      'climbing:grade:ice',
    ],
    type: 'text',
    label: 'Grade',
  },

  'climbing/orientation': {
    key: 'climbing:orientation',
    type: 'combo',
    options: {
      N: 'North',
      NE: 'North-East',
      E: 'East',
      SE: 'South-East',
      S: 'South',
      SW: 'South-West',
      W: 'West',
      NW: 'North-West',
    },
    label: 'Orientation',
  },
  'climbing/urls': {
    keys: [
      'climbing:url:mountainproject',
      'climbing:url:openbeta',
      'climbing:url:thecrag',
    ],
    type: 'url',
    label: 'Websites',
  },

  'climbing/routes': {
    key: 'climbing:routes',
    type: 'number',
    minValue: 0,
    label: 'Number of routes',
  },
};

export const ourPresets = {
  'leisure/climbing/crag_2': {
    icon: 'temaki-abseiling',
    fields: ['climbing/rock', 'climbing/orientation', 'climbing/routes'],
    moreFields: Object.keys(ourFields),
    geometry: ['point', 'relation'],
    tags: { climbing: 'crag' },
    name: 'Climbing crag',
  },

  'leisure/climbing/route': {
    icon: 'temaki-abseiling',
    fields: [
      'climbing/grade',
      'climbing/length',
      'climbing/bolts',
      'climbing/orientation',
    ],
    moreFields: Object.keys(ourFields),
    geometry: ['point', 'line'],
    tags: { climbing: 'route' },
    name: 'Climbing route',
  },
  'leisure/climbing/route_bottom': {
    icon: 'temaki-abseiling',
    fields: [
      'climbing/grade',
      'climbing/length',
      'climbing/bolts',
      'climbing/orientation',
    ],
    moreFields: Object.keys(ourFields),
    geometry: ['point'],
    tags: { climbing: 'route_bottom' },
    name: 'Climbing route - start',
  },
  'leisure/climbing/route_top': {
    icon: 'temaki-abseiling',
    fields: [],
    moreFields: Object.keys(ourFields),
    geometry: ['point'],
    tags: { climbing: 'route_top' },
    name: 'Climbing route - top',
  },

  'leisure/climbing/site': {
    icon: 'temaki-abseiling',
    fields: [],
    moreFields: Object.keys(ourFields),
    geometry: ['point', 'line', 'area'],
    tags: { sport: 'climbing' }, // we need only sport=climbing without gyms: leisure=sport_center, is it possible?
    name: 'Climbing site',
    matchScore: 0.9,
  },
} as RawPresets;

export const getOurTranslations = (lang) => ({
  [lang]: {
    presets: {
      presets: ourPresets,
      fields: ourFields,
    },
  },
});
