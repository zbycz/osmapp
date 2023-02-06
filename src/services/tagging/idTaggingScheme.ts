import { Feature } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';
import { Preset } from './types/Presets';
import { fields, presets } from './data';

// links like {shop}, are recursively resolved to their fields
const getResolvedFields = (fieldKeys: string[]): string[] =>
  fieldKeys.flatMap((key) => {
    if (key.match(/^{.*}$/)) {
      const presetKey = key.substr(1, key.length - 2);
      return getResolvedFields(presets[presetKey].fields); // TODO does "{shop}" links to preset's fields or moreFields?
    }
    return key;
  });

const getResolvedFieldsWithParents = (
  preset: Preset,
  fieldType: 'fields' | 'moreFields',
): string[] => {
  const parts = preset.presetKey.split('/');

  if (parts.length > 1) {
    const parentKey = parts.slice(0, parts.length - 1).join('/');
    const parentPreset = presets[parentKey];
    return [
      ...getResolvedFieldsWithParents(parentPreset, fieldType),
      ...(preset[fieldType] ?? []),
    ];
  }

  return preset[fieldType] ?? [];
};

const getAllFieldKeys = (preset: Preset) => {
  const allFieldKeys = [
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'fields')),
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'moreFields')),
  ];

  // @ts-ignore
  return [...new Set(allFieldKeys)];
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  const fieldKeys = getAllFieldKeys(preset);
  const matchedFields = fieldKeys
    .map((fieldKey: string) => {
      const field = fields[fieldKey];
      const value = feature.tags[field?.key];
      const fieldTranslation = getFieldTranslation(fieldKey);

      // TODO resolve field.label={building} for its translated label
      const label = fieldTranslation?.label ?? field.label;

      return {
        field,
        fieldTranslation,
        label,
        value: fieldTranslation?.options?.[value] ?? value,
      };
    })
    .filter((field) => field.value);

  const tagsWithFields = Object.entries(feature.tags).map(([key, value]) => {
    const field = Object.values(fields).find(
      (f) => f.key === key || f.keys?.includes(key),
    ); // todo cache this
    const fieldTranslation = field ? getFieldTranslation(field.fieldKey) : {};
    return {
      key,
      value,
      field,
      label: fieldTranslation?.label ?? `[${key}]`,
    };
  });

  return {
    presetKey: preset.presetKey,
    preset,
    label: getPresetTranslation(preset.presetKey),
    matchedFields,
    tagsWithFields,
  };
};
