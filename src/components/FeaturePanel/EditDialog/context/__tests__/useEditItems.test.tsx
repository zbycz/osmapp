import { act, renderHook } from '@testing-library/react';
import { useEditItems } from '../useEditItems';
import { addEmptyOriginalState } from '../itemsHelpers';
import { DataItem } from '../types';

const initialItem: DataItem = addEmptyOriginalState({
  shortId: 'n1',
  version: 1,
  tagsEntries: Object.entries({ amenity: 'cafe' }),
  toBeDeleted: false,
  nodeLonLat: [14, 50],
  sections: [],
});

describe('useEditItems', () => {
  it('should add a new feature', () => {
    const { result } = renderHook(() => useEditItems());

    act(() => {
      result.current.addItem(initialItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].shortId).toEqual('n1');
    expect(result.current.items[0].version).toEqual(1);
    expect(result.current.items[0].presetKey).toEqual('amenity/cafe');
    expect(result.current.items[0].tags).toEqual({ amenity: 'cafe' });

    const newItem: DataItem = addEmptyOriginalState({
      shortId: 'n2',
      version: 1,
      tagsEntries: [['amenity', 'restaurant']],
      toBeDeleted: false,
      nodeLonLat: [14, 50],
      sections: [],
    });

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[1].tags).toEqual({ amenity: 'restaurant' });
  });

  it('should update tags of a feature', () => {
    const { result } = renderHook(() => useEditItems());

    act(() => {
      result.current.addItem(initialItem);
    });

    act(() => {
      result.current.items[0].setTag('name', 'Test Cafe');
    });

    expect(result.current.items[0].tags).toEqual({
      amenity: 'cafe',
      name: 'Test Cafe',
    });
  });

  it('should toggle toBeDeleted flag', () => {
    const { result } = renderHook(() => useEditItems());

    act(() => {
      result.current.addItem(initialItem);
    });

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
