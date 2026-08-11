import {
  getFinalTagsEntries,
  getKeptTagsEntries,
  willBeDeleted,
} from '../placeCancelled';
import { DataItem, TagsEntries } from '../types';

const item = (tagsEntries: TagsEntries, toBeDeleted = true) =>
  ({ shortId: 'n1', tagsEntries, toBeDeleted }) as DataItem;

describe('getKeptTagsEntries', () => {
  it('should keep nothing for a plain poi', () => {
    expect(
      getKeptTagsEntries([
        ['amenity', 'cafe'],
        ['name', 'Coffee'],
      ]),
    ).toEqual([]);
  });

  it('should keep address tags and drop poi tags', () => {
    expect(
      getKeptTagsEntries([
        ['amenity', 'cafe'],
        ['name', 'Coffee'],
        ['addr:street', 'Main'],
        ['addr:housenumber', '5'],
        ['opening_hours', 'Mo-Fr'],
      ]),
    ).toEqual([
      ['addr:street', 'Main'],
      ['addr:housenumber', '5'],
    ]);
  });

  it('should keep building tags', () => {
    expect(
      getKeptTagsEntries([
        ['shop', 'bakery'],
        ['building', 'yes'],
        ['building:levels', '2'],
      ]),
    ).toEqual([
      ['building', 'yes'],
      ['building:levels', '2'],
    ]);
  });

  it('should keep accompanying tags only along with an address', () => {
    expect(
      getKeptTagsEntries([
        ['shop', 'books'],
        ['level', '1'],
      ]),
    ).toEqual([]);

    expect(
      getKeptTagsEntries([
        ['shop', 'books'],
        ['addr:housenumber', '5'],
        ['level', '1'],
      ]),
    ).toEqual([
      ['addr:housenumber', '5'],
      ['level', '1'],
    ]);
  });

  it('should ignore empty tags', () => {
    expect(
      getKeptTagsEntries([
        ['addr:street', ''],
        ['', 'x'],
        ['shop', 'books'],
      ]),
    ).toEqual([]);
  });
});

describe('willBeDeleted', () => {
  it('should be false when not cancelled', () => {
    expect(willBeDeleted(item([['amenity', 'cafe']], false))).toBe(false);
  });

  it('should be true when nothing is left', () => {
    expect(willBeDeleted(item([['amenity', 'cafe']]))).toBe(true);
  });

  it('should be false when an address is left', () => {
    expect(
      willBeDeleted(
        item([
          ['amenity', 'cafe'],
          ['addr:street', 'Main'],
        ]),
      ),
    ).toBe(false);
  });
});

describe('getFinalTagsEntries', () => {
  it('should return all tags when not cancelled', () => {
    const tagsEntries: TagsEntries = [['amenity', 'cafe']];
    expect(getFinalTagsEntries(item(tagsEntries, false))).toEqual(tagsEntries);
  });

  it('should return only kept tags when cancelled', () => {
    expect(
      getFinalTagsEntries(
        item([
          ['amenity', 'cafe'],
          ['addr:street', 'Main'],
        ]),
      ),
    ).toEqual([['addr:street', 'Main']]);
  });
});
