import { getImageDefs } from '../getImageDefs';
import { ImageDef } from '../../types';

const center = [14, 50];

const tags = {
  wikimedia_commons: 'File:1.jpg',
  'wikimedia_commons:path': '0.1,0.2|0.8,0.9B',
  'wikimedia_commons:2': 'File:2.jpg',
  'wikimedia_commons:2:path': '0.1,0.2|0.8,0.9whatever🙂',
  'wikimedia_commons:xy': 'Category:cat.jpg',
  image: 'blah blah url',
  image2: 'image2 url',
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
    v: 'blah blah url',
    instant: true,
  },
  {
    type: 'tag',
    k: 'image2',
    v: 'image2 url',
    instant: true,
  },
  {
    type: 'tag',
    k: 'wikimedia_commons:xy',
    v: 'Category:cat.jpg',
    instant: false,
  },
  {
    type: 'center',
    service: 'mapillary',
    center: [14, 50],
  },
];

test('conversion', () => {
  expect(getImageDefs(tags, center)).toEqual(imageDefs);
});
