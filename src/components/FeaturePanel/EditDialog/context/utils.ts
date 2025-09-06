import { DataItem } from './types';
import { getApiId } from '../../../../services/helpers';
import { findPreset } from '../../../../services/tagging/presets';

export const isInItems = (items: DataItem[], shortId: string) =>
  items.some((item) => item.shortId === shortId);

export const findInItems = (items: DataItem[], shortId: string) =>
  items.find((item) => item.shortId === shortId);

export const getName = (d: DataItem): string | undefined =>
  d.tagsEntries.find(([k]) => k === 'name')?.[1];

export const getLabel = (newRelation: DataItem) =>
  getName(newRelation) ?? newRelation.shortId;

export const getPresetKey = ({ shortId, tagsEntries }: DataItem) => {
  const tags = Object.fromEntries(tagsEntries);
  const osmId = getApiId(shortId);
  const preset = findPreset(osmId.type, tags);
  return preset.presetKey;
};
