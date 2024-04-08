import { osmToClimbingRoutes } from '../osmToClimbingRoutes';
import { Feature } from '../../../../../services/types';

const feature: Feature = {
  type: 'Feature',
  center: [-73.0630908, 43.9068891],
  osmMeta: {
    type: 'relation',
    id: 14334600,
  },
  tags: {
    climbing: 'crag',
    'climbing:grade:yds_class:max': '5.9+',
    'climbing:grade:yds_class:min': '5.7',
    'climbing:rock': 'quartzite',
    'climbing:routes': '7',
    'climbing:url:thecrag': 'https://www.thecrag.com/395435010',
    name: 'The North Overhangs',
    site: 'sport',
    sport: 'climbing',
    type: 'site',
  },
  properties: {
    class: 'climbing',
    subclass: 'climbing',
  },
  memberFeatures: [
    {
      type: 'Feature',
      center: [-73.0630918, 43.9068925],
      osmMeta: {
        type: 'way',
        id: 1076927500,
        role: '',
      },
      tags: {
        climbing: 'route',
        'climbing:grade:yds_class': '5.7',
        'climbing:length': "100'",
        name: 'Otter',
        sport: 'climbing',
      },
      properties: {
        class: 'climbing',
        subclass: 'climbing',
      },
    },
    {
      type: 'Feature',
      center: [-73.0630651, 43.9067905],
      osmMeta: {
        type: 'way',
        id: 1076927501,
        role: '',
      },
      tags: {
        climbing: 'route',
        'climbing:grade:yds_class': '5.7',
        'climbing:length': "100'",
        'climbing:pitches': '1',
        'climbing:toprope': 'yes',
        'climbing:trad': 'yes',
        wikimedia_commons: 'File:jickovice1.jpg',
        'wikimedia_commons:path': '0.8,0.8B|0.573,0.245A',
        'wikimedia_commons:2': 'File:jickovice2.jpg',
        'wikimedia_commons:2:path': '0.1,0.1|0.573,0.245A',
        wikimedia_commons3: 'File:jickovice3.jpg', // deprecated numbering suffix
        name: 'Red Squirrel',
        sport: 'climbing',
      },
      properties: {
        class: 'climbing',
        subclass: 'climbing',
      },
    },
  ],
} as unknown as Feature; // TODO correct types in shelve

const climbingRoutes = [
  {
    difficulty: {
      grade: '5.7',
      gradeSystem: 'yds_class',
    },
    id: 'way/1076927500',
    length: "100'",
    name: 'Otter',
    paths: {},
    photoToKeyMap: {},
    feature: feature.memberFeatures[0],
  },
  {
    difficulty: {
      grade: '5.7',
      gradeSystem: 'yds_class',
    },
    id: 'way/1076927501',
    length: "100'",
    name: 'Red Squirrel',
    paths: {
      'jickovice1.jpg': [
        {
          units: 'percentage',
          x: 0.8,
          y: 0.8,
          type: 'bolt',
        },
        {
          units: 'percentage',
          x: 0.573,
          y: 0.245,
          type: 'anchor',
        },
      ],
      'jickovice2.jpg': [
        {
          units: 'percentage',
          x: 0.1,
          y: 0.1,
        },
        {
          units: 'percentage',
          x: 0.573,
          y: 0.245,
          type: 'anchor',
        },
      ],
      'jickovice3.jpg': [],
    },
    photoToKeyMap: {
      'jickovice1.jpg': 'wikimedia_commons',
      'jickovice2.jpg': 'wikimedia_commons:2',
      'jickovice3.jpg': 'wikimedia_commons3',
    },
    feature: feature.memberFeatures[1],
  },
];

test('osmToClimbingRoutes', () => {
  expect(osmToClimbingRoutes(feature)).toEqual(climbingRoutes);
});
