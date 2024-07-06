import { osmToFeature } from '../osmToFeature';

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
    wikimedia_commons: 'File:Lomy nad Velkou - Borová věž.jpg',
    'wikimedia_commons:path': '0.32,0.902|0.371,0.537B|0.406,0.173A',
    'wikimedia_commons:2': 'File:Lomy nad Velkou - Borová věž3.jpg',
    'wikimedia_commons:2:path': '0.924,0.797|0.773,0.428B|0.562,0.056A',
  },
};

const geojson = {
  type: 'Feature',
  center: [14.2523716, 49.6541269],
  osmMeta: {
    changeset: 147615480,
    id: 6,
    timestamp: '2024-02-18T16:07:20Z',
    type: 'node',
    uid: 162287,
    user: 'zby-cz',
    version: 12,
  },
  properties: { class: 'climbing', subclass: 'climbing' },
  tags: nodeResponse.tags,
  imageTags: [
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lomy_nad_Velkou_-_Borová_věž.jpg/410px-Lomy_nad_Velkou_-_Borová_věž.jpg',
      k: 'wikimedia_commons',
      pathTag: '0.32,0.902|0.371,0.537B|0.406,0.173A',
      path: [
        { suffix: '', x: 0.32, y: 0.902 },
        { suffix: 'B', x: 0.371, y: 0.537 },
        { suffix: 'A', x: 0.406, y: 0.173 },
      ],
      type: 'wikimedia_commons',
      v: 'File:Lomy nad Velkou - Borová věž.jpg',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lomy_nad_Velkou_-_Borová_věž3.jpg/410px-Lomy_nad_Velkou_-_Borová_věž3.jpg',
      k: 'wikimedia_commons:2',
      pathTag: '0.924,0.797|0.773,0.428B|0.562,0.056A',
      path: [
        { suffix: '', x: 0.924, y: 0.797 },
        { suffix: 'B', x: 0.773, y: 0.428 },
        { suffix: 'A', x: 0.562, y: 0.056 },
      ],
      type: 'wikimedia_commons',
      v: 'File:Lomy nad Velkou - Borová věž3.jpg',
    },
  ],
};

test('node conversion with imageTags', () => {
  // imageTags are not tested in osmApi.test.ts
  expect(osmToFeature(nodeResponse)).toEqual(geojson);
});
