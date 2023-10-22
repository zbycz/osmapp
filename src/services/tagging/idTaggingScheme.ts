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

const featuredKeysO = [
  'website',
  'contact:website',
  'phone',
  'contact:phone',
  'contact:mobile',
  'opening_hours',
  'description',
  'fhrs:id',
  // 'wikipedia',
  // 'wikidata',
  // more ideas in here, run in browser: Object.values(dbg.fields).filter(f=>f.universal)
];

const deduplicate = (strings: string[]) => [...new Set(strings)];

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
      const shouldWeIncludeThisField =
        keysTodo.has(key) || keysTodo.hasAny(keys);
      if (!shouldWeIncludeThisField) {
        return {};
      }
      if (field.type === 'typeCombo') {
        keysTodo.remove(field.key); // ignores eg. railway=tram_stop on public_transport=stop_position
        return {};
      }

      const value = feature.tags[key];

      const keysInField = deduplicate([
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ]);
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

const matchRestToFields = (keysTodo: typeof keysTodo, feature: Feature) =>
  keysTodo
    .map((key) => {
      // const field =
      //   key === "ref"
      //     ? fields.ref
      //     : Object.values(fields).find(
      //     (f) => f.key === key || f.keys?.includes(key)
      //     ); // todo cache this

      // if more fielas are matching, select the one which has fieldKey equal key
      const matchingFields = Object.values(fields).filter(
        (f) => f.key === key || f.keys?.includes(key),
      );
      const field =
        matchingFields.find((f) => f.fieldKey === key) ?? matchingFields[0];
      if (matchingFields.length > 1) {
        console.warn(
          `More fields matching key ${key}: ${matchingFields.map(
            (f) => f.fieldKey,
          )}`,
        );
      }

      if (!field) {
        return {};
      }
      if (field.type === 'typeCombo') {
        keysTodo.remove(field.key); // ignores eg. railway=tram_stop on public_transport=stop_position
        return {};
      }

      const value = feature.tags[key];

      const keysInField = deduplicate([
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ]);
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
  resolveTags(tags) {
    Object.keys(tags).forEach((key) => this.remove(key));
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
    // we need a clone, because we modify the array
    return [...this.state].map(fn);
  },
};

const getFeaturedTags = (feature: Feature) => {
  const { tags } = feature;

  // TODO no featuredTags for deleted

  const featuredKeys = [
    ...featuredKeysO,
    ...(tags.wikipedia ? ['wikipedia'] : tags.wikidata ? ['wikidata'] : []),
  ];
  return featuredKeys.reduce((acc, key) => {
    if (tags[key]) {
      acc[key] = tags[key];
    }
    return acc;
  }, {});
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  keysTodo.init(feature);
  keysTodo.resolveTags(preset.tags); // remove tags which are already covered by Preset keys
  keysTodo.remove('name'); // always rendered by FeaturePanel

  const featuredTags = getFeaturedTags(feature);
  keysTodo.resolveTags(featuredTags);

  const matchedFields = matchFieldsFromPreset(preset, keysTodo, feature);
  keysTodo.resolveFields(matchedFields);

  const tagsWithFields = matchRestToFields(keysTodo, feature);
  keysTodo.resolveFields(tagsWithFields);

  return {
    presetKey: preset.presetKey,
    preset,
    feature,
    label: getPresetTranslation(preset.presetKey),
    featuredTags: Object.entries(featuredTags),
    matchedFields,
    tagsWithFields,
    keysTodo: keysTodo.state,
  };
};
