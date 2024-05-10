import { Feature } from './types';
import { addSchemaToFeature } from './tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';

// this is raw response from openstreetmap api
const nodeResponse = {
  type: 'node',
  id: 6,
  lat: 49.6541269,
  lon: 14.2523716,
  timestamp: '2024-02-18T16:07:20Z',
  version: 12,
  changeset: 147615480,
  user: 'zby-cz',
  uid: 162287,
  tags: {
    climbing: 'route_bottom',
    'climbing:grade:uiaa': '5',
    name: 'Test item for images',
    description: 'Originally Detonátor route',
    sport: 'climbing',
    /*
    wikimedia_commons: 'File:Lomy nad Velkou - Borová věž.jpg',
    'wikimedia_commons:2': 'File:Lomy nad Velkou - Borová věž3.jpg',
    'wikimedia_commons:2:path':
      '0.924,0.797|0.773,0.428B|0.708,0.307B|0.636,0.174B|0.581,0.086B|0.562,0.056A',
    'wikimedia_commons:3': 'File:Lomy nad Velkou - Borová věž4.jpg',
    'wikimedia_commons:3:path': '0.933,0.757|0.729,0.286|0.637,0.136',
    'wikimedia_commons:path':
      '0.32,0.902|0.371,0.537B|0.372,0.433B|0.388,0.298B|0.4,0.206B|0.406,0.173A',
    */
    image: 'http://localhost:3000/images/Lomy_nad_Velkou_-_Borová_věž.jpg',
    'image:path':
      '0.32,0.902|0.371,0.537B|0.372,0.433B|0.388,0.298B|0.4,0.206B|0.406,0.173A',
    'image:2': 'http://localhost:3000/images/Lomy_nad_Velkou_-_Borová_věž3.jpg',
    'image:2:path':
      '0.924,0.797|0.773,0.428B|0.708,0.307B|0.636,0.174B|0.581,0.086B|0.562,0.056A',
    'image:3': 'http://localhost:3000/images/Lomy_nad_Velkou_-_Borová_věž4.jpg',
    'image:3:path': '0.933,0.757|0.729,0.286|0.637,0.136',

    // from nearby village
    wikidata: 'Q11878531',
  },
};
export const TEST_NODE = {
  ...addSchemaToFeature(osmToFeature(nodeResponse)),
  parentFeatures: [
    addSchemaToFeature({
      type: 'Feature',
      osmMeta: {
        type: 'relation',
        id: 17262674,
      },
      tags: {
        climbing: 'crag',
        name: 'Pravá plotna',
        site: 'climbing',
        type: 'site',
        wikimedia_commons: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      },
      properties: {
        class: 'climbing',
        subclass: 'crag',
      },
    } as unknown as Feature),
    {
      type: 'Feature',
      osmMeta: { type: 'relation', id: 6 },
      tags: { name: 'Nejlepší cesty v ČR' },
    },
  ],
} as unknown as Feature;
// TODO correct types inspiro in shelve

// TODO duplicated code from testfile
// this is already converted to osmapp's Feature
export const TEST_CRAG: Feature = {
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
