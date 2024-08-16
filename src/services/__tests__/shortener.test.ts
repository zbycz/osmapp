import { getIdFromShortener, getShortenerSlug } from '../shortener';
import { OsmId, OsmType } from '../types';

const node: OsmId = { type: 'node', id: 11_660_046_031 };
const way: OsmId = { type: 'way', id: 173_514_748 };
const relation: OsmId = { type: 'relation', id: 17_089_246 };
const nonOsm: OsmId = { type: 'type7' as OsmType, id: 8 };

test('getShortenerSlug', () => {
  // NOTE: we can never change these in future - it would invalidate already "created" slugs!
  expect(getShortenerSlug(node)).toBe('rtqty0n');
  expect(getShortenerSlug(way)).toBe('opsgqew');
  expect(getShortenerSlug(relation)).toBe('blkhysr');
  expect(getShortenerSlug(nonOsm)).toBe(null);
});

describe('getIdFromShortener', () => {
  it('converts', () => {
    expect(getIdFromShortener('rtqty0n')).toEqual(node);
    expect(getIdFromShortener('opsgqew')).toEqual(way);
    expect(getIdFromShortener('blkhysr')).toEqual(relation);
  });

  it('fails on invalid chars', () => {
    expect(getIdFromShortener('_n')).toBe(null);
    expect(getIdFromShortener('1w')).toBe(null);
    expect(getIdFromShortener('1r')).toBe(null);
  });

  it('uses substitutions to one (I->1, l->1)', () => {
    expect(getIdFromShortener('11n')).toEqual({ type: 'node', id: 3000 });
    expect(getIdFromShortener('IIn')).toEqual({ type: 'node', id: 3000 });
    expect(getIdFromShortener('lln')).toEqual({ type: 'node', id: 3000 });
  });

  it('uses substitutions to zero', () => {
    expect(getIdFromShortener('10n')).toEqual({ type: 'node', id: 2999 });
    expect(getIdFromShortener('1On')).toEqual({ type: 'node', id: 2999 });
  });
});
