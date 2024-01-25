import { osmToClimbingRoutes } from '../osmToClimbingRoutes';
import { Feature } from '../../../../../services/types';

const path1 = [
  { x: 0.8, y: 0.712, units: 'percentage' },
  { x: 0.783, y: 0.547, units: 'percentage' },
  { x: 0.675, y: 0.387, units: 'percentage' },
  { x: 0.583, y: 0.368, units: 'percentage' },
  { x: 0.546, y: 0.282, units: 'percentage' },
  { x: 0.571, y: 0.27, units: 'percentage' },
  { x: 0.573, y: 0.245, units: 'percentage' },
];
const getPathString = (path) => path.map(({ x, y }) => `${x},${y}`).join('|');

const feature: Feature = {
  type: 'Feature',
  center: [-73.0630908, 43.9068891],
  osmMeta: {
    type: 'relation',
    id: 14334600,
    timestamp: '2023-12-22T17:12:51Z',
    version: 4,
    changeset: 145414117,
    user: '4b3eff',
    uid: 14349548,
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
        timestamp: '2022-07-18T17:03:11Z',
        version: 2,
        changeset: 123772465,
        user: 'Adam Franco',
        uid: 27832,
        role: '',
      },
      tags: {
        climbing: 'route',
        'climbing:grade:yds_class': '5.7',
        'climbing:length': "100'",
        'climbing:pitches': '1',
        'climbing:toprope': 'yes',
        'climbing:trad': 'yes',
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
        timestamp: '2022-07-08T19:29:58Z',
        version: 1,
        changeset: 123379162,
        user: 'Adam Franco',
        uid: 27832,
        role: '',
      },
      tags: {
        climbing: 'route',
        'climbing:grade:yds_class': '5.7',
        'climbing:length': "100'",
        'climbing:pitches': '1',
        'climbing:toprope': 'yes',
        'climbing:trad': 'yes',
        'climbing:image': `/images/jickovice1.jpg#${getPathString(path1)}`,
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
    id: 'way/1076927500',
    length: "100'",
    name: 'Otter',
    paths: {},
  },
  {
    id: 'way/1076927501',
    length: "100'",
    name: 'Red Squirrel',
    paths: {
      '/images/jickovice1.jpg': [
        { x: 0.8, y: 0.712, units: 'percentage' },
        { x: 0.783, y: 0.547, units: 'percentage' },
        { x: 0.675, y: 0.387, units: 'percentage' },
        { x: 0.583, y: 0.368, units: 'percentage' },
        { x: 0.546, y: 0.282, units: 'percentage' },
        { x: 0.571, y: 0.27, units: 'percentage' },
        { x: 0.573, y: 0.245, units: 'percentage' },
      ],
    },
  },
];

test('conversion', () => {
  expect(osmToClimbingRoutes(feature)).toEqual(climbingRoutes);
});
