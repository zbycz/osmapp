import { RawPresets } from './types/Presets';
import type { RawFields } from './types/Fields';

// until https://github.com/openstreetmap/id-tagging-schema/pull/1113 is merged

export const ourFields: RawFields = {
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
  'climbing/bolts': {
    key: 'climbing:bolts',
    type: 'number',
    minValue: 0,
  },
  'climbing/bolted': {
    key: 'climbing:bolted',
    type: 'check',
  },
  'climbing/bolt': {
    key: 'climbing:bolt',
    type: 'combo',
    options: ['expansion', 'glue-in', 'ring'],
  },
  'climbing/grade/uiaa': {
    key: 'climbing:grade:uiaa',
    type: 'text',
  },
  'climbing/grade/saxon': {
    key: 'climbing:grade:saxon',
    type: 'text',
  },
  'climbing/grade/french': {
    key: 'climbing:grade:french',
    type: 'text',
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
    addTags: {
      sport: 'climbing',
      climbing: 'route_bottom',
    },
  },
  'climbing/route': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'line'],
    fields: [
      'name',
      'climbing/length',
      'climbing/grade/uiaa',
      'climbing/grade/french',
      'climbing/grade/saxon',
    ],
    moreFields: [
      'climbing/bolts',
      'climbing/bolted',
      'climbing/bolt',
      'climbing/orientation',
      'climbing/quality',
      'climbing/rock',
      'climbing/summit_log',
      'website',
      'ele',
    ],
    tags: {
      climbing: 'route',
    },
    addTags: {
      sport: 'climbing',
      climbing: 'route',
    },
  },
  'climbing/crag': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'relation'],
    fields: ['name'],
    moreFields: [
      'climbing/length',
      'climbing/routes',
      'climbing/bolted',
      'climbing/bolt',
      'climbing/orientation',
      'climbing/quality',
      'climbing/rock',
      'website',
      'ele',
    ],
    tags: {
      climbing: 'crag',
    },
    addTags: {
      sport: 'climbing',
      climbing: 'crag',
    },
  },
  'climbing/area': {
    icon: 'temaki-abseiling',
    geometry: ['relation'],
    fields: ['name'],
    tags: {
      climbing: 'area',
    },
    addTags: {
      sport: 'climbing',
      climbing: 'area',
    },
  },
} as RawPresets;

export const getOurTranslations = (lang) => ({
  [lang]: {
    presets: {
      presets: {
        'climbing/route_bottom': {
          name:
            lang === 'cs'
              ? 'Lezecká cesta (začátek)'
              : 'Climbing Route (start)',
          terms: 'rock climbing,climbing',
        },
        'climbing/route': {
          name: lang === 'cs' ? 'Lezecká cesta' : 'Climbing Route',
          terms: 'rock climbing,climbing',
        },
        'climbing/crag': {
          name: lang === 'cs' ? 'Lezecký sektor (skála, věž)' : 'Climbing Crag',
          terms: 'rock climbing,climbing',
        },
        'climbing/area': {
          name: lang === 'cs' ? 'Lezecká oblast' : 'Climbing Area',
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
        'climbing/bolts': {
          label: 'Number of bolts',
        },
        'climbing/bolted': {
          label: 'Bolted',
        },
        'climbing/bolt': {
          label: 'Bolt type',
          options: {
            expansion: 'expansion bolt',
            'glue-in': 'glue-in bolt',
            ring: 'ring bolt',
          },
        },
        'climbing/grade/uiaa': {
          label: 'Grade (UIAA)',
          placeholder: '6-',
        },
        'climbing/grade/saxon': {
          label: 'Grade (saxon)',
          placeholder: 'VIIa',
        },
        'climbing/grade/french': {
          label: 'Grade (french)',
          placeholder: '5c',
        },
      },
    },
  },
});
