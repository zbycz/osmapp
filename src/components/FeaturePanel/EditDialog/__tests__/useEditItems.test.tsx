import { renderHook } from '@testing-library/react-hooks';
import { useEditItems } from '../useEditItems';
import { Feature } from '../../../../services/types';
// @ts-ignore
import { act } from 'react';

const originalFeature: Feature = {
  osmMeta: { type: 'node', id: 1 },
  tags: { amenity: 'cafe' },
  type: 'Feature',
  properties: { class: 'x', subclass: 'y' },
  center: [14, 50],
};

describe('useEditItems', () => {
  it('should initialize with the original feature', () => {
    const { result } = renderHook(() => useEditItems(originalFeature));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].shortId).toEqual('n1');
    expect(result.current.items[0].tags).toEqual(originalFeature.tags);
  });

  it('should add a new feature', () => {
    const { result } = renderHook(() => useEditItems(originalFeature));

    const newFeature: Feature = {
      osmMeta: { type: 'node', id: 2 },
      tags: { amenity: 'restaurant' },
      type: 'Feature',
      properties: { class: 'x', subclass: 'y' },
      center: [14, 50],
    };

    act(() => {
      result.current.addFeature(newFeature);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[1].tags).toEqual(newFeature.tags);
  });

  it('should update tags of a feature', () => {
    const { result } = renderHook(() => useEditItems(originalFeature));

    act(() => {
      result.current.items[0].setTag('name', 'Test Cafe');
    });

    expect(result.current.items[0].tags).toEqual({
      amenity: 'cafe',
      name: 'Test Cafe',
    });
  });

  it('should toggle toBeDeleted flag', () => {
    const { result } = renderHook(() => useEditItems(originalFeature));

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
