import { Feature } from "../types";
import { getFieldTranslation, getPresetTranslation } from "./translations";
import { getPresetForFeature } from "./presets";
import { fields } from "./data";
import { getAllFieldKeys, getValueForField } from "./fields";

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
      const key = field?.key; // TODO handle `keys` as well
      if (!keysToDo.includes(key)) {
        return {};
      }
      if (field.type === 'typeCombo') {
        keysToDo.splice(keysToDo.indexOf(field.key), 1); // ignore eg. railway=tram_stop on public_transport=stop_position
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
      if (field.type === 'typeCombo') {
        keysToDo.splice(keysToDo.indexOf(field.key), 1); // ignore eg. railway=tram_stop on public_transport=stop_position
        return {};
      }

      // TODO make this generic + add to matchedFields as well
      // maybe gather all tags and just print them near this field
      const keysInField = [
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ];
      const tagsForField = [];
      keysInField.forEach((k) => {
        if (feature.tags[k]) {
          tagsForField.push({ key: k, value: feature.tags[k] });
        }
        keysToDo.splice(keysToDo.indexOf(k), 1); // remove all "address:*" keys etc.
      });

      const fieldTranslation = getFieldTranslation(field);

      return {
        key,
        value: getValueForField(field, fieldTranslation, value),
        field,
        tagsForField,
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
