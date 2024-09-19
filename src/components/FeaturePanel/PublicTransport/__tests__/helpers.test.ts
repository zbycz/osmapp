import { sortByReference } from '../helpers';

describe('sortBy', () => {
  it('sorts correctly based on reference array', () => {
    const unsorted = ['apple', 'banana', 'cherry'];
    const reference = ['banana', 'cherry', 'apple'];

    const result = sortByReference(unsorted, reference, (item) => item);

    expect(result).toEqual(['banana', 'cherry', 'apple']);
  });

  it('sorts correctly using a functor', () => {
    const unsorted = [
      { name: 'apple' },
      { name: 'banana' },
      { name: 'cherry' },
    ];
    const reference = ['banana', 'cherry', 'apple'];

    const result = sortByReference(unsorted, reference, (item) => item.name);

    expect(result).toEqual([
      { name: 'banana' },
      { name: 'cherry' },
      { name: 'apple' },
    ]);
  });

  it('handles items not in reference array', () => {
    const unsorted = ['apple', 'banana', 'cherry', 'date', '#2date'];
    const reference = ['banana', 'cherry', 'apple'];

    const result = sortByReference(unsorted, reference, (item) => item);

    expect(result).toEqual(['banana', 'cherry', 'apple', 'date', '#2date']);
  });

  it('handles empty unsorted array', () => {
    const unsorted: string[] = [];
    const reference = ['banana', 'cherry', 'apple'];

    const result = sortByReference(unsorted, reference, (item) => item);

    expect(result).toEqual([]);
  });

  it('handles empty reference array', () => {
    const unsorted = ['apple', 'banana', 'cherry'];
    const reference: string[] = [];

    const result = sortByReference(unsorted, reference, (item) => item);

    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('handles both arrays being empty', () => {
    const unsorted: string[] = [];
    const reference: string[] = [];

    const result = sortByReference(unsorted, reference, (item) => item);

    expect(result).toEqual([]);
  });
});
