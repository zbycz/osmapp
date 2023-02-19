import { Feature } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';
import { Preset } from './types/Presets';
import { fields, presets } from './data';

// TODO move to shared place
const featuredKeys = [
  'name', // this is not in the other place
  'website',
  'contact:website',
  'phone',
  'contact:phone',
  'contact:mobile',
  'opening_hours',
  'description',
];

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
    if (parentPreset) {
      return [
        ...getResolvedFieldsWithParents(parentPreset, fieldType),
        ...(preset[fieldType] ?? []),
      ];
    }
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

const getValueForField = (field, fieldTranslation, value: string) => {
  if (field.type === 'semiCombo') {
    return value
      .split(';')
      .map((v) => fieldTranslation?.options?.[v] ?? v)
      .join(',\n');
  }

  return fieldTranslation?.options?.[value] ?? value;
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  const keysToDo = Object.keys(feature.tags).filter(
    (key) => !featuredKeys.includes(key),
  );

  // remove tags which are already covered by Preset name
  Object.keys(preset.tags).forEach((key) => {
    keysToDo.splice(keysToDo.indexOf(key), 1);
  });

  const fieldKeys = getAllFieldKeys(preset);
  const matchedFields = fieldKeys
    .map((fieldKey: string) => {
      const field = fields[fieldKey];
      const key = field?.key;
      if (!keysToDo.includes(key)) {
        return {};
      }

      const value = feature.tags[key];
      const fieldTranslation = getFieldTranslation(field);
      const label = fieldTranslation?.label ?? field.label;

      return {
        key,
        value: getValueForField(field, fieldTranslation, value),
        field,
        fieldTranslation,
        label,
      };
    })
    .filter((field) => field.value);

  matchedFields.forEach((field) => {
    if (field?.field?.key)
      keysToDo.splice(keysToDo.indexOf(field.field.key), 1);
    if (field?.field?.keys)
      field.field.keys.forEach((key) =>
        keysToDo.splice(keysToDo.indexOf(key), 1),
      );
  });

  const tagsWithFields = keysToDo
    .map((key) => {
      const value = feature.tags[key];
      const field = Object.values(fields).find(
        (f) => f.key === key || f.keys?.includes(key),
      ); // todo cache this
      if (!field) {
        return {};
      }

      // TODO gather all tags and just print them near this field
      // const keysInField = [...(field.keys ?? []), ...(field.key ? [field.key] : [])];
      // keysInField.forEach((key) => {
      //   keysToDo.splice(keysToDo.indexOf(key), 1); //remove all "address:*" keys etc.
      // })

      const fieldTranslation = getFieldTranslation(field);

      return {
        key,
        value: getValueForField(field, fieldTranslation, value),
        field,
        fieldTranslation,
        label: fieldTranslation?.label ?? `[${key}]`,
      };
    })
    .filter((field) => field.field);

  tagsWithFields.forEach((field) => {
    if (field.field.key) keysToDo.splice(keysToDo.indexOf(field.field.key), 1);
    if (field.field.keys)
      field.field.keys.forEach((key) =>
        keysToDo.splice(keysToDo.indexOf(key), 1),
      );
  });

  // TODO fix one field with more tags! like address
  return {
    presetKey: preset.presetKey,
    preset,
    fieldKeys,
    feature,
    label: getPresetTranslation(preset.presetKey),
    matchedFields,
    tagsWithFields,
    restKeys: keysToDo,
  };
};
