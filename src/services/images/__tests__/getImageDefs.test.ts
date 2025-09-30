import { getImageDefs } from '../getImageDefs';

import { ImageDef, LonLat } from '../../types';

const center: LonLat = [14, 50];

test('conversion', () => {
  const tags = {
    wikimedia_commons: 'File:1.jpg',
    'wikimedia_commons:path': '0.1,0.2|0.8,0.9B',
    'wikimedia_commons:2': 'File:2.jpg',
    'wikimedia_commons:2:path': '0.1,0.2|0.8,0.9whatever🙂',
    'wikimedia_commons:xy': 'Category:cat.jpg',
    image: 'http://blah blah url',
    image2: 'File:image2 like commons image name',
    'image:license': 'to be ignored',
    website: 'https://site-may-have-og-image',
  };

  const imageDefs: ImageDef[] = [
    {
      type: 'tag',
      k: 'wikimedia_commons',
      v: 'File:1.jpg',
      instant: true,
      path: [
        { suffix: '', x: 0.1, y: 0.2 },
        { suffix: 'B', x: 0.8, y: 0.9 },
      ],
    },
    {
      type: 'tag',
      k: 'wikimedia_commons:2',
      v: 'File:2.jpg',
      instant: true,
      path: [
        { suffix: '', x: 0.1, y: 0.2 },
        { suffix: 'whatever🙂', x: 0.8, y: 0.9 },
      ],
    },
    {
      type: 'tag',
      k: 'image',
      v: 'http://blah blah url',
      instant: true,
    },
    {
      type: 'tag',
      k: 'image2',
      v: 'File:image2 like commons image name',
      instant: true,
    },
    {
      type: 'tag',
      k: 'wikimedia_commons:xy',
      v: 'Category:cat.jpg',
      instant: false,
    },
    {
      type: 'tag',
      k: 'website',
      v: 'https://site-may-have-og-image',
      instant: false,
    },
    {
      type: 'center',
      service: 'panoramax',
      center: [14, 50],
    },
    {
      type: 'center',
      service: 'kartaview',
      center: [14, 50],
    },
    {
      type: 'center',
      service: 'mapillary',
      center: [14, 50],
    },
  ];

  expect(getImageDefs(tags, 'node', center)).toEqual(imageDefs);
});

test('correctly sorted', () => {
  const tags = {
    'wikimedia_commons:3': 'Category:1.jpg',
    'wikimedia_commons:10': 'File:15.jpg',
    wikidata: 'Q123',
    'wikimedia_commons:9': 'File:14.jpg',
    wikimedia_commons: 'File:1.jpg',
    image: 'http://blah blah url',
    image2: 'File:image2 like commons image name',
    'wikipedia:cs': '2.jpg',
    'image:2': 'https://commons.wikimedia.org/wiki/File%3Axxxx4.jpg',
    'ignored-non-image-tag': 'x',
  };

  expect(getImageDefs(tags, 'node', center).map((def: any) => def.k)).toEqual([
    'wikimedia_commons',
    'wikimedia_commons:9',
    'wikimedia_commons:10',
    'image',
    'image2',
    'image:2',
    'wikipedia:cs',
    'wikidata',
    'wikimedia_commons:3',
    undefined, // mapillary
  ]);
});

test('no center for relation', () => {
  const tags = {};
  expect(getImageDefs(tags, 'node', center)).toHaveLength(3);
  expect(getImageDefs(tags, 'relation', center)).toEqual([]);
});
