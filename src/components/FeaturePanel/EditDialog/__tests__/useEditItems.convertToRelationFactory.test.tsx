import { fetchParentFeatures } from '../../../../services/osm/fetchParentFeatures';
import { fetchWays } from '../../../../services/osm/fetchWays';
import { fetchFreshItem } from '../itemsHelpers';
import { getNewId } from '../../../../services/getCoordsFeature';

import { convertToRelationFactory, DataItem } from '../useEditItems';

jest.mock('../../../../services/osm/fetchParentFeatures', () => ({
  fetchParentFeatures: jest.fn(),
}));
jest.mock('../../../../services/osm/fetchWays', () => ({
  fetchWays: jest.fn(),
}));
jest.mock('../itemsHelpers', () => ({
  fetchFreshItem: jest.fn(),
}));
jest.mock('../../../../services/getCoordsFeature', () => ({
  getNewId: jest.fn(),
}));

const initialNode: DataItem = {
  shortId: 'n123',
  version: 1,
  tagsEntries: [
    ['natural', 'peak'],
    ['name', 'stays in both'],
    ['climbing', 'crag'],
    ['climbing:asdf', 'ghj'],
    ['sport', 'climbing'],
  ],
  toBeDeleted: false,
  nodeLonLat: [14, 50],
  nodes: undefined,
  members: undefined,
};

const parentItem: DataItem = {
  shortId: 'r99',
  tagsEntries: [['type', 'site']],
  version: 1,
  toBeDeleted: false,
  nodeLonLat: undefined,
  nodes: undefined,
  members: undefined,
};
const parentFeature = { osmMeta: { type: 'relation', id: 99 } };

describe('convertToRelationFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert node to relation', async () => {
    (fetchParentFeatures as any).mockResolvedValue([parentFeature]);
    (fetchFreshItem as any).mockResolvedValue(parentItem);
    (fetchWays as any).mockResolvedValue([]);
    (getNewId as any).mockReturnValue(-1);

    let data = [initialNode];
    const setData = (fn: (prev: DataItem[]) => DataItem[]) => {
      data = fn(data);
    };

    const convertToRelation = convertToRelationFactory(setData, 'n123');

    const newShortId = await convertToRelation();
    expect(newShortId).toBe('r-1');

    expect(data).toHaveLength(3);
    expect(data[0].shortId).toBe('n123');
    expect(data[0].tagsEntries).toEqual([
      ['natural', 'peak'],
      ['name', 'stays in both'],
    ]);
    expect(data[1].shortId).toBe('r-1');
    expect(data[1].tagsEntries).toEqual([
      ['type', 'site'],
      ['site', 'climbing'],
      ['name', 'stays in both'],
      ['climbing', 'crag'],
      ['climbing:asdf', 'ghj'],
      ['sport', 'climbing'],
    ]);
    expect(data[2].shortId).toBe('r99');
  });

  it('should throw error if node is part of a way', async () => {
    (fetchParentFeatures as any).mockResolvedValue([]);
    (fetchWays as any).mockResolvedValue([{}]);
    (getNewId as any).mockReturnValue(-1);

    let data = [initialNode];
    const setData = (fn: (prev: DataItem[]) => DataItem[]) => {
      data = fn(data);
    };

    const convertToRelation = convertToRelationFactory(setData, 'n123');

    await expect(convertToRelation()).rejects.toThrow(
      "Can't convert node n123 which is part of a way.",
    );
  });
});
