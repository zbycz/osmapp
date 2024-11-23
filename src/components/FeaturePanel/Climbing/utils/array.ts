import { images } from 'next/dist/build/webpack/config/blocks/images';

export const addElementToIndex = <T>(
  array: Array<T>,
  index: number,
  newItem: T,
): Array<T> => {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
};

export const moveElementToIndex = <T>(
  array: Array<T>,
  elementIndex: number,
  moveToIndex: number,
): Array<T> => {
  const temp = array[elementIndex];
  const tempArray = updateElementOnIndex(array, elementIndex, null);
  return addElementToIndex(tempArray, moveToIndex, temp).filter((item) => item);
};
export const updateElementOnIndex = <T>(
  array: Array<T>,
  index: number,
  callback?: (oldValue: T) => T,
): Array<T> => {
  const updatedItem = callback ? callback(array[index]) : null;
  return [
    ...array.slice(0, index),
    ...(updatedItem ? [updatedItem] : []),
    ...array.slice(index + 1),
  ];
};

export const swapItemsInArray = <T>(
  array: Array<T>,
  fromIndex: number,
  toIndex: number,
) => {
  const newArray = [...array];
  const temp = newArray[fromIndex];
  newArray[fromIndex] = newArray[toIndex];
  newArray[toIndex] = temp;
  return newArray;
};
export const deleteFromArray = <T>(array: Array<T>, index: number) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

export const addElementToArray = <T>(array: Array<T>, newElement: T) => [
  ...array,
  newElement,
];
export const toggleElementInArray = <T>(array: Array<T>, element: T) => {
  const index = array.indexOf(element);
  if (index > -1) {
    return deleteFromArray(array, index);
  }
  return addElementToArray(array, element);
};

export const naturalCompare = (a, b) => {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export const naturalSort = (array, reducer = (item) => item) => {
  return array.sort((a, b) => {
    return naturalCompare(reducer(a), reducer(b));
  });
};
