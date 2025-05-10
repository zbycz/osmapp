import { act, renderHook } from '@testing-library/react';
import { DataItem, useEditItems } from '../useEditItems';

const initialItem: DataItem = {
  shortId: 'n1',
  version: 1,
  tagsEntries: Object.entries({ amenity: 'cafe' }),
  toBeDeleted: false,
  nodeLonLat: [14, 50],
  nodes: undefined,
  members: undefined,
};

describe('useEditItems', () => {
  it('should initialize with the original feature', () => {
    const { result } = renderHook(() => useEditItems(initialItem));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].shortId).toEqual('n1');
    expect(result.current.items[0].version).toEqual(1);
    expect(result.current.items[0].presetKey).toEqual('amenity/cafe');
    expect(result.current.items[0].tags).toEqual({ amenity: 'cafe' });
  });

  it('should add a new feature', () => {
    const { result } = renderHook(() => useEditItems(initialItem));

    const newItem: DataItem = {
      shortId: 'n2',
      version: 1,
      tagsEntries: [['amenity', 'restaurant']],
      toBeDeleted: false,
      nodeLonLat: [14, 50],
      nodes: undefined,
      members: undefined,
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[1].tags).toEqual({ amenity: 'restaurant' });
  });

  it('should update tags of a feature', () => {
    const { result } = renderHook(() => useEditItems(initialItem));

    act(() => {
      result.current.items[0].setTag('name', 'Test Cafe');
    });

    expect(result.current.items[0].tags).toEqual({
      amenity: 'cafe',
      name: 'Test Cafe',
    });
  });

  it('should toggle toBeDeleted flag', () => {
    const { result } = renderHook(() => useEditItems(initialItem));

    act(() => {
      result.current.items[0].toggleToBeDeleted();
    });

    expect(result.current.items[0].toBeDeleted).toBe(true);

    act(() => {
      result.current.items[0].toggleToBeDeleted();
    });

    expect(result.current.items[0].toBeDeleted).toBe(false);
  });
});
