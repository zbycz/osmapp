import { Feature } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';
import { fields } from './data';
import { computeAllFieldKeys, getValueForField } from './fields';
import { Preset } from './types/Presets';
import { publishDbgObject } from '../../utils';

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

const matchFieldsFromPreset = (
  preset: Preset,
  keysTodo: any,
  feature: Feature,
) => {
  const computedAllFieldKeys = computeAllFieldKeys(preset);
  publishDbgObject('computedAllFieldKeys', computedAllFieldKeys);

  return computedAllFieldKeys
    .map((fieldKey: string) => {
      const field = fields[fieldKey];
      const key = field?.key;
      const keys = field?.keys;
      const shouldWeIncludeThisField = keysTodo.has(key) || keysTodo.hasAny(keys);
      if (!shouldWeIncludeThisField) {
        return {};
      }
      if (field.type === 'typeCombo') {
        keysTodo.remove(field.key); // ignore eg. railway=tram_stop on public_transport=stop_position
        return {};
      }

      const value = feature.tags[key];

      const keysInField = [
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ];
      const tagsForField = [];
      keysInField.forEach((k) => {
        if (feature.tags[k]) {
          tagsForField.push({ key: k, value: feature.tags[k] });
        }
        keysTodo.remove(k); // remove all "address:*" keys etc.
      });

      const fieldTranslation = getFieldTranslation(field);

      return {
        key,
        value: getValueForField(field, fieldTranslation, value, tagsForField),
        field,
        tagsForField,
        fieldTranslation,
        label: fieldTranslation?.label ?? field.label,
      };
    })
    .filter((field) => field.value);
};

const matchRestToFields = (keysTodo: any, feature: Feature) =>
  keysTodo
    .map((key) => {
      const field = Object.values(fields).find(
        (f) => f.key === key || f.keys?.includes(key),
      ); // todo cache this
      if (!field) {
        return {};
      }
      if (field.type === 'typeCombo') {
        keysTodo.remove(field.key); // ignore eg. railway=tram_stop on public_transport=stop_position
        return {};
      }

      const value = feature.tags[key];

      const keysInField = [
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ];
      const tagsForField = [];
      keysInField.forEach((k) => {
        if (feature.tags[k]) {
          tagsForField.push({ key: k, value: feature.tags[k] });
        }
        keysTodo.remove(k); // remove all "address:*" keys etc.
      });

      const fieldTranslation = getFieldTranslation(field);

      return {
        key,
        value: getValueForField(field, fieldTranslation, value, tagsForField),
        field,
        tagsForField,
        fieldTranslation,
        label: fieldTranslation?.label ?? field.label ?? `[${key}]`,
      };
    })
    .filter((field) => field.field);

const keysTodo = {
  state: [],
  init(feature) {
    this.state = Object.keys(feature.tags).filter(
      (key) => !featuredKeys.includes(key),
    );
  },
  resolve(tags) {
    Object.keys(tags).forEach((key) => {
      this.state.splice(this.state.indexOf(key), 1);
    });
  },
  has(key) {
    return this.state.includes(key);
  },
  hasAny(keys) {
    return keys?.some((key) => this.state.includes(key));
  },
  remove(key) {
    const index = this.state.indexOf(key);
    if (index > -1) {
      this.state.splice(index, 1);
    }
  },
  resolveFields(fieldsArray) {
    fieldsArray.forEach((field) => {
      if (field?.field?.key) {
        this.remove(field.field.key);
      }
      if (field?.field?.keys) {
        field.field.keys.forEach((key) => this.remove(key));
      }
    });
  },
  map(fn) {
    return this.state.map(fn);
  },
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  keysTodo.init(feature);
  keysTodo.resolve(preset.tags); // remove tags which are already covered by Preset keys

  const matchedFields = matchFieldsFromPreset(preset, keysTodo, feature);
  keysTodo.resolveFields(matchedFields);

  const tagsWithFields = matchRestToFields(keysTodo, feature);
  keysTodo.resolveFields(tagsWithFields);

  // TODO fix one field with more tags! like address
  return {
    presetKey: preset.presetKey,
    preset,
    feature,
    label: getPresetTranslation(preset.presetKey),
    matchedFields,
    tagsWithFields,
    keysTodo: keysTodo.state,
  };
};

