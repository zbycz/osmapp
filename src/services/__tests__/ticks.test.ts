import { getStorageIndex } from '../ticks';

const ticks = [
  {
    osmId: 'n3462908984',
    date: '2024-04-17T15:59:42.163Z',
    style: 'PP' as const,
  },
  {
    osmId: 'n3462910811',
    date: '2024-04-17T16:00:16.911Z',
    style: 'FS' as const,
  },
];

const osmId = 'n3462908984';
test('getStorageIndex', () => {
  expect(getStorageIndex(ticks, osmId, 0)).toBe(0);
});
