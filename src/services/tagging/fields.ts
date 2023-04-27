// links like {shop}, are recursively resolved to their fields
import { Preset } from './types/Presets';
import { presets } from './data';

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
    if (parentPreset) {
      return [
        ...getResolvedFieldsWithParents(parentPreset, fieldType),
        ...(preset[fieldType] ?? []),
      ];
    }
  }

  return preset[fieldType] ?? [];
};

export const computeAllFieldKeys = (preset: Preset) => {
  const allFieldKeys = [
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'fields')),
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'moreFields')),
  ];

  // @ts-ignore
  return [...new Set(allFieldKeys)];
};

export const getValueForField = (
  field,
  fieldTranslation,
  value: string,
  tagsForField = [],
) => {
  if (field.type === 'semiCombo') {
    return value
      .split(';')
      .map((v) => fieldTranslation?.options?.[v] ?? v)
      .join(',\n');
  }
  //eg field.type === 'access' or 'structure'
  if (fieldTranslation?.types && fieldTranslation?.options) {
    return tagsForField
      .map(
        ({ key, value: value2 }) =>
          `${fieldTranslation.types[key]}: ${fieldTranslation.options[value2]?.title}`,
      )
      .join(',\n');
  }

  return fieldTranslation?.options?.[value] ?? value;
};
