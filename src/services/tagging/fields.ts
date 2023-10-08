// links like {shop}, are recursively resolved to their fields
import { Preset } from './types/Presets';
import { fields, presets } from './data';

const getResolvedFields = (fieldKeys: string[]): string[] =>
  fieldKeys.flatMap((key) => {
    if (key.match(/^{.*}$/)) {
      const presetKey = key.substr(1, key.length - 2);
      return getResolvedFields(presets[presetKey].fields);
    }
    return key;
  });

const getResolvedMoreFields = (fieldKeys: string[]): string[] =>
  fieldKeys.flatMap((key) => {
    if (key.match(/^{.*}$/)) {
      const presetKey = key.substr(1, key.length - 2);
      return getResolvedMoreFields(presets[presetKey].moreFields);
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
    ...getResolvedMoreFields(
      getResolvedFieldsWithParents(preset, 'moreFields'),
    ),
    ...Object.values(fields)
      .filter((f) => f.universal)
      .map((f) => f.fieldKey),
    'operator'
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
  // eg field.type === 'access' or 'structure'
  if (fieldTranslation?.types && fieldTranslation?.options) {
    return tagsForField
      .map(
        ({ key, value: value2 }) =>
          `${fieldTranslation.types[key]}: ${fieldTranslation.options[value2]?.title}`,
      )
      .join(',\n');
  }

  // TODO this is not correct
  if (tagsForField.length >= 2) {
    return tagsForField
      .map(({ key, value: value2 }) => `${key}: ${value2}`)
      .join(',\n');
  }

  return fieldTranslation?.options?.[value] ?? value;
};
