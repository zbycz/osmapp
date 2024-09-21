/**
 * Sorts an array of items based on their order in a reference array.
 *
 * @template TInput The type of the items in the unsorted array.
 * @template TRef The type of the items in the reference array.
 * @param {TInput[]} unsorted - The array of items to sort.
 * @param {TRef[]} reference - The reference array defining the desired order.
 * @param {(item: TInput) => TRef} functor - A function that maps each item in the unsorted array to a corresponding item in the reference array.
 * @returns {TInput[]} The sorted array.
 *
 * @example
 * ```typescript
 * sortByReference(
 * 	[{ name: "cherry" }, { name: "apple" }, { name: "banana" }, { name: "date" }],
 * 	["apple", "banana", "cherry"],
 * 	(item) => item.name
 * );
 * ```
 */
export function sortByReference<TInput, TRef>(
  unsorted: TInput[],
  reference: TRef[],
  functor: (item: TInput) => TRef,
): TInput[] {
  const ind = (x: TInput) => reference.indexOf(functor(x));

  return unsorted.sort((a, b) => {
    const aIndex = ind(a);
    const bIndex = ind(b);

    if (aIndex === -1) return 1;

    if (aIndex < bIndex) return -1;
    if (aIndex > bIndex) return 1;

    return 0;
  });
}
