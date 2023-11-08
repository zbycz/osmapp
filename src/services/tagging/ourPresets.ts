import { Presets } from './types/Presets';

export const getOurTranslations = (lang) => ({
  [lang]: {
    presets: {
      presets: {
        'leisure/climbing/site': {
          name: 'Climbing site',
          terms: 'Místo k lezení',
        },
        'leisure/climbing/route': {
          name: 'Climbing route',
          terms: 'lezecká cesta',
        },
        'leisure/climbing/route_bottom': {
          name: 'Start of climbing route',
          terms: 'začátek lezecké cesty',
        },
        'leisure/climbing/route_top': {
          name: 'Top of climbing route',
          terms: 'top lezecké cesty',
        },
      },
    },
  },
});

export const ourPresets = {
  // i want only sport=climbing without gyms: leisure=sport_center
  'leisure/climbing/site': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'way', 'area'],
    fields: [],
    tags: {
      sport: 'climbing',
    },
    reference: {
      key: 'sport',
      value: 'climbing',
    },
    name: 'Climbing site', // could be both gym or
  },
  'leisure/climbing/route': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'way'],
    fields: [],
    tags: {
      climbing: 'route',
    },
    addTags: {
      sport: 'climbing',
      climbing: 'route',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Climbing route',
  },
  'leisure/climbing/route_bottom': {
    icon: 'temaki-abseiling',
    geometry: ['point'],
    fields: [],
    tags: {
      climbing: 'route_bottom',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Bottom of climbing route',
  },
  'leisure/climbing/route_top': {
    icon: 'temaki-abseiling',
    geometry: ['point'],
    fields: [],
    tags: {
      climbing: 'route_top',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Top of climbing route',
  },
} as unknown as Presets;
