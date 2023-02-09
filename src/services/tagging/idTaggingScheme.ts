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

  const tagsToDo = Object.keys(feature.tags).filter(
    (key) => !featuredKeys.includes(key),
  );

  const fieldKeys = getAllFieldKeys(preset);
  const matchedFields = fieldKeys
    .map((fieldKey: string) => {
      const field = fields[fieldKey];
      const osmKey = field?.key;
      if (!tagsToDo.includes(osmKey) || field.type === 'typeCombo') {
        // TODO not sure how to tell that tower:type is also already covered (/way/26426951)
        return {};
      }

      const value = feature.tags[osmKey];
      const fieldTranslation = getFieldTranslation(field);
      const label = fieldTranslation?.label ?? field.label;

      return {
        field,
        fieldTranslation,
        label,
        value: fieldTranslation?.options?.[value] ?? value,
      };
    })
    .filter((field) => field.value);

  matchedFields.forEach((field) => {
    if (field?.field?.key)
      tagsToDo.splice(tagsToDo.indexOf(field.field.key), 1);
    if (field?.field?.keys)
      field.field.keys.forEach((key) =>
        tagsToDo.splice(tagsToDo.indexOf(key), 1),
      );
  });

  const tagsWithFields = tagsToDo
    .map((key) => {
      const value = feature.tags[key];
      const field = Object.values(fields).find(
        (f) => f.key === key || f.keys?.includes(key),
      ); // todo cache this
      const fieldTranslation = field ? getFieldTranslation(field) : undefined;

      return {
        key,
        value,
        field,
        label: fieldTranslation?.label ?? `[${key}]`,
      };
    })
    .filter((field) => field.field);

  tagsWithFields.forEach((field) => {
    if (field.field.key) tagsToDo.splice(tagsToDo.indexOf(field.field.key), 1);
    if (field.field.keys)
      field.field.keys.forEach((key) =>
        tagsToDo.splice(tagsToDo.indexOf(key), 1),
      );
  });

  // TODO fix one field with more tags! like address
  return {
    presetKey: preset.presetKey,
    preset,
    label: getPresetTranslation(preset.presetKey),
    matchedFields,
    tagsWithFields,
    restKeys: tagsToDo,
  };
};
