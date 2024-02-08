import { RawPresets } from './types/Presets';

export const ourFields = {
  'climbing/summit_log': {
    key: 'climbing:summit_log',
    type: 'check',
  },
  'climbing/routes': {
    key: 'climbing:routes',
    type: 'number',
    minValue: 0,
  },
  'climbing/rock': {
    key: 'climbing:rock',
    type: 'combo',
    options: ['limestone', 'sandstone', 'granite', 'basalt'],
  },
  'climbing/quality': {
    key: 'climbing:quality',
    type: 'combo',
    options: ['fragile', 'medium', 'solid'],
  },
  'climbing/orientation': {
    key: 'climbing:orientation',
    type: 'combo',
    options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  },
  'climbing/length': {
    key: 'climbing:length',
    type: 'number',
    minValue: 0,
  },
  'climbing/grade': {
    key: 'climbing:grade:uiaa',
    type: 'text',
  },
  'climbing/bolts': {
    key: 'climbing:bolts',
    type: 'number',
    minValue: 0,
  },
  'climbing/bolted': {
    key: 'climbing:bolted',
    type: 'check',
  },
  'climbing/bolt_type': {
    key: 'climbing:bolt_type',
    type: 'combo',
    options: ['expansion', 'glue-in', 'ring'],
  },
};

export const ourPresets = {
  'climbing/route_bottom': {
    icon: 'temaki-abseiling',
    geometry: ['point'],
    fields: ['{climbing/route}'],
    moreFields: ['{climbing/route}'],
    tags: {
      climbing: 'route_bottom',
    },
  },
  'climbing/route': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'line'],
    fields: [
      'climbing/grade',
      'climbing/bolts',
      'climbing/bolt_type',
      'climbing/bolted',
      'climbing/length',
      'climbing/orientation',
      'climbing/quality',
      'climbing/rock',
      'climbing/summit_log',
      'website',
    ],
    moreFields: ['ele'],
    tags: {
      climbing: 'route',
    },
  },
  'climbing/crag': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'relation'],
    fields: [
      'climbing/routes',
      'climbing/bolt_type',
      'climbing/bolted',
      'climbing/length',
      'climbing/orientation',
      'climbing/quality',
      'climbing/rock',
      'website',
    ],
    moreFields: ['ele'],
    tags: {
      climbing: 'crag',
    },
  },
} as RawPresets;

export const getOurTranslations = (lang) => ({
  [lang]: {
    presets: {
      presets: {
        'climbing/route_bottom': {
          name: 'Climbing route (start)',
          terms: 'rock climbing,climbing',
        },
        'climbing/route': {
          name: 'Climbing route',
          terms: 'rock climbing,climbing',
        },
        'climbing/crag': {
          name: 'Climbing crag',
          terms: 'rock climbing,climbing',
        },
      },
      fields: {
        'climbing/summit_log': {
          label: 'Summit log',
        },
        'climbing/routes': {
          label: 'Number of routes',
        },
        'climbing/rock': {
          label: 'Rock type',
        },
        'climbing/quality': {
          label: 'Rock quality',
        },
        'climbing/orientation': {
          label: 'Orientation',
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
        },
        'climbing/length': {
          label: 'Length (m)',
        },
        'climbing/grade': {
          label: 'Grade',
          placeholder: '6+',
        },
        'climbing/bolts': {
          label: 'Number of bolts',
        },
        'climbing/bolted': {
          label: 'Bolted',
        },
        'climbing/bolt_type': {
          label: 'Bolt type',
          options: {
            expansion: 'expansion bolt',
            'glue-in': 'glue-in bolt',
            ring: 'ring bolt',
          },
        },
      },
    },
  },
});
