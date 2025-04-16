import { FieldTranslation, Preset } from './types/Presets';
import { allFields, allPresets } from './data';
import { deduplicate } from './utils';
import { Field } from './types/Fields';
import { getFieldTranslation } from './translations';

type FieldType = 'fields' | 'moreFields';

// links like {shop}, are recursively resolved to their fields
const resolveLinks = (fieldKeys: string[], type: FieldType): string[] =>
  fieldKeys.flatMap((key) => {
    if (key.match(/^{.*}$/)) {
      const presetKey = key.substr(1, key.length - 2);
      const linkedFields = allPresets[presetKey][type];
      return resolveLinks(linkedFields, type);
    }
    return key;
  });

const resolveParents = (preset: Preset, type: FieldType): string[] => {
  const parts = preset.presetKey.split('/');

  if (parts.length > 1) {
    const parentKey = parts.slice(0, parts.length - 1).join('/');
    const parentPreset = allPresets[parentKey];
    if (parentPreset) {
      return [...resolveParents(parentPreset, type), ...(preset[type] ?? [])];
    }
  }

  return preset[type] ?? [];
};

const resolveFieldKeys = (preset: Preset, fieldType: FieldType) =>
  resolveLinks(resolveParents(preset, fieldType), fieldType);

const resolveFields = (preset: Preset, fieldType: FieldType): Field[] =>
  resolveFieldKeys(preset, fieldType).map((key) => allFields[key]);

const getUniversalFields = (): Field[] =>
  Object.values(allFields).filter((f) => f.universal);

export const getFieldKeys = (preset: Preset): string[] => {
  const allFieldKeys = [
    ...resolveFieldKeys(preset, 'fields'),
    ...resolveFieldKeys(preset, 'moreFields'),
    ...getUniversalFields().map((f) => f.fieldKey),
    'operator',
    'architect',
    'address',
  ]
    .filter((f) => f !== 'wikipedia') // already covered in featuredKeys
    .filter((f) => f !== 'image') // already covered in feature image
    .filter((f) => f !== 'source' && f !== 'check_date'); // lets leave these to tagsWithFields

  return deduplicate(allFieldKeys);
};

const translateFields = (fields: Field[]): Field[] =>
  fields.map((field) => {
    const fieldTranslation = getFieldTranslation(field);
    return {
      ...field,
      fieldTranslation: { label: `[${field.fieldKey}]`, ...fieldTranslation },
    };
  });

const eatPreset = (preset: Preset, fields: Field[]) => {
  return fields.filter((field) => !preset.tags[field.key]);
};

export const getFields = (preset: Preset) => {
  const fields = resolveFields(preset, 'fields');
  const moreFields = resolveFields(preset, 'moreFields');
  const universalFields = getUniversalFields();

  return {
    fields: eatPreset(preset, translateFields(fields)),
    moreFields: translateFields(moreFields),
    universalFields: translateFields(universalFields),
  };
};

export const translateField = (
  fieldTranslation: FieldTranslation | undefined,
  v: string,
): string => {
  const option = fieldTranslation?.options?.[v];

  if (typeof option === 'string') {
    return option;
  }
  if (option?.description && option?.title) {
    return `${option.title} – ${option.description}`;
  }
  if (option?.title) {
    return option.title;
  }

  return v;
};

// TODO check - 1) field.options 2) strings.options
export const getValueForField = (
  field: Field,
  fieldTranslation: FieldTranslation,
  value: string | undefined,
  tagsForField = [],
): string => {
  if (field.type === 'semiCombo') {
    return value
      .split(';')
      .map((v) => translateField(fieldTranslation, v))
      .join(',\n');
  }

  // eg field.type === 'access' or 'structure'
  if (fieldTranslation?.types && fieldTranslation?.options) {
    return tagsForField
      .map(
        ({ key, value: value2 }) =>
          `${fieldTranslation.types[key]}: ${translateField(fieldTranslation, value2)}`,
      )
      .join(',\n');
  }

  // TODO this is not correct
  if (tagsForField.length >= 2) {
    return tagsForField
      .map(({ key, value: value2 }) => `${key}: ${value2}`)
      .join(',\n');
  }

  return translateField(fieldTranslation, value);
};
