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
