import { DataItem, TagsEntries } from './types';

const ADDRESS_KEYS = [
  /^addr:/,
  /^source:addr(:|$)/,
  /^(noaddress|nohousenumber)$/,
  /^building$/,
  /^building:/,
  /^roof:/,
  /^(height|min_height)$/,
  /^entrance$/,
];

const ACCOMPANYING_KEYS = [/^(layer|level|location|indoor|room)$/];

const matches = (patterns: RegExp[], key: string) =>
  patterns.some((pattern) => pattern.test(key));

export const getKeptTagsEntries = (tagsEntries: TagsEntries): TagsEntries => {
  const kept = tagsEntries.filter(
    ([k, v]) =>
      k && v && (matches(ADDRESS_KEYS, k) || matches(ACCOMPANYING_KEYS, k)),
  );

  return kept.some(([k]) => matches(ADDRESS_KEYS, k)) ? kept : [];
};

export const willBeDeleted = (item: DataItem) =>
  item.toBeDeleted && getKeptTagsEntries(item.tagsEntries).length === 0;

export const getFinalTagsEntries = (item: DataItem): TagsEntries =>
  item.toBeDeleted ? getKeptTagsEntries(item.tagsEntries) : item.tagsEntries;
