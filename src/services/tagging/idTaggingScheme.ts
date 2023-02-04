import presets from '../../../data/presets.json';
import fields from '../../../data/fields.json';
import { Feature } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';


// build a key lookup table for fields by osm key
// const fieldsByOsmKey = {};
// Object.entries(fields).forEach(([fieldKey, field]) => {
//   if (field.key) {
//     fieldsByOsmKey[field.key] = fieldKey;
//   }
//   if (field.keys) {
//     field.keys.forEach((key) => (fieldsByOsmKey[key] = fieldKey));
//   }
// });

// links to another use that preset's name contained in brackets, like {preset}.
const getResolvedFields = (fields) => {
  console.log('fields', fields);
  const flatMap = fields.flatMap((field) => {
    if (field.match(/^\{.*\}$/)) {
      const presetName = field.substr(1, field.length - 2);
      return getResolvedFields(presets[presetName].fields); // TODO does "{shop}" links to preset's fields or moreFields?
    }
    return field;
  });
  console.log('flatMap', flatMap);
  return flatMap;
};

function getResolvedFieldsWithParents(preset, fieldType) {
  const parts = preset.presetKey.split('/');

  if (parts.length > 1) {
    const parentKey = parts.slice(0, parts.length - 1).join('/');
    const parentPreset = { presetKey: parentKey, ...presets[parentKey] };
    return [
      ...getResolvedFieldsWithParents(parentPreset, fieldType),
      ...(preset[fieldType] ?? []),
    ];
  }

  return preset[fieldType] ?? [];
}

const getAllFields = (preset) => {
  const newVar = [
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'fields')),
    ...getResolvedFields(getResolvedFieldsWithParents(preset, 'moreFields')),
  ];
  // get unique fields by key
  newVar.filter((field, index, self) => {
    return self.indexOf(field) === index;
  });

  return newVar;
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  const allFields = getAllFields(preset);
  const uniqFields = [...new Set(allFields)];
  const matchedFields = uniqFields.map((fieldKey) => {
    const field = { fieldKey, ...fields[fieldKey] };
    const value = feature.tags[field?.key];
    const fieldTranslation = getFieldTranslation(fieldKey);

    return {
      field,
      fieldTranslation,
      label: fieldTranslation?.label,
      value: fieldTranslation?.options?.[value] ?? value,
    };
  });

  return {
    presetKey: preset.presetKey,
    preset,
    label: getPresetTranslation(preset.presetKey),
    matchedFields,
  };
};
