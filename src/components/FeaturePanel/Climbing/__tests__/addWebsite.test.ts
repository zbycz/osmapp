import { addWebsite } from '../addWebsite';
import { DataItem } from '../../EditDialog/context/types';

const shortId = 'n123';
const makeDataItem = (tagsEntries: [string, string][]) =>
  ({
    shortId,
    tagsEntries,
  }) as DataItem;

const run = (tagsEntries: [string, string][]) => {
  return addWebsite({
    shortId,
    tagsEntries,
  } as DataItem);
};

describe('addWebsite', () => {
  test('no tags', () => {
    const data = makeDataItem([]);
    const result = addWebsite(data);
    expect(result.tagsEntries).toEqual([
      ['website', 'https://openclimbing.org/node/123'],
    ]);
  });

  it('existing website:1', () => {
    const result = run([['website:1', 'https://example.com']]);
    expect(result.tagsEntries).toEqual([
      ['website', 'https://openclimbing.org/node/123'],
      ['website:1', 'https://example.com'],
    ]);
  });

  test('moves website to website:1', () => {
    const result = run([['website', 'https://example.com']]);
    expect(result.tagsEntries).toEqual([
      ['website', 'https://openclimbing.org/node/123'],
      ['website:1', 'https://example.com'],
    ]);
  });

  test('multi websites', () => {
    const result = run([
      ['website:1', 'https://example.com'],
      ['website:3', 'https://example.com'],
      ['website', 'https://example.com'],
      ['website:other', 'https://example.com'],
    ]);
    expect(result.tagsEntries).toEqual([
      ['website', 'https://openclimbing.org/node/123'],
      ['website:1', 'https://example.com'],
    ]);
  });

  //
  // it('přidá website:1 když existuje pouze website', () => {
  //   const data = makeDataItem([['website', 'https://example.com']]);
  //   const result = addWebsite(data);
  //   expect(result.tagsEntries).toContainEqual(['website:1', url]);
  // });
  //
  // it('přidá website:2 když existuje website:other', () => {
  //   const data = makeDataItem([['website:other', 'https://other.com']]);
  //   const result = addWebsite(data);
  //   expect(result.tagsEntries).toContainEqual(['website:1', url]);
  // });
  //
  // it('nepřidá duplicitu pokud už url existuje', () => {
  //   const data = makeDataItem([['website:1', url]]);
  //   const result = addWebsite(data);
  //   const count = result.tagsEntries.filter(([k, v]) => v === url).length;
  //   expect(count).toBe(1);
  // });
  //
  // it('přidá website:N když existuje více číslovaných tagů', () => {
  //   const data = makeDataItem([
  //     ['website:1', 'https://a.com'],
  //     ['website:2', 'https://b.com'],
  //     ['website:3', 'https://c.com'],
  //   ]);
  //   const result = addWebsite(data);
  //   expect(result.tagsEntries).toContainEqual(['website:4', url]);
  // });
});
