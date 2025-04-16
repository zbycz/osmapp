import { Feature, FeatureTags } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';
import { allFields } from './data';
import { getFieldKeys, getValueForField } from './fields';
import { Preset, UiField } from './types/Presets';
import { publishDbgObject } from '../../utils';
import { getShortId } from '../helpers';
import { Field } from './types/Fields';
import { DEBUG_ID_SCHEMA } from '../../config.mjs';
import { FEATURED_KEYS } from './featuredKeys';
import { deduplicate } from './utils';
import { KeysTodo, keysTodo } from './keysTodo';

const logMoreMatchingFields = (matchingFields: Field[], key: string) => {
  if (DEBUG_ID_SCHEMA && matchingFields.length > 1) {
    // eslint-disable-next-line no-console
    console.debug(
      `More fields matching key ${key}: ${matchingFields.map(
        (f) => f.fieldKey,
      )}`,
    );
  }
};

const getUiField = (
  field: Field,
  keysTodo: KeysTodo,
  feature: Feature,
  key: string,
): UiField => {
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
    value: getValueForField(field, fieldTranslation, value, tagsForField), // TODO this may be removed
    label: fieldTranslation?.label ?? field.label ?? `[${key}]`,
    tagsForField,
    field,
    fieldTranslation,
  };
};

const matchFieldsFromPreset = (
  preset: Preset,
  keysTodo: KeysTodo,
  feature: Feature,
): UiField[] => {
  const fieldKeys = getFieldKeys(preset);
  publishDbgObject('all fieldKeys', fieldKeys);

  return fieldKeys
    .map((fieldKey: string) => {
      const field = allFields[fieldKey];
      const key = field?.key;
      const keys = field?.keys;
      const includeThisField = keysTodo.has(key) || keysTodo.hasAny(keys);

      if (!includeThisField) {
        return undefined;
      }

      return getUiField(field, keysTodo, feature, key);
    })
    .filter(Boolean);
};

const matchRestToFields = (keysTodo: KeysTodo, feature: Feature): UiField[] =>
  keysTodo.mapOrSkip((key) => {
    const matchingFields = Object.values(allFields).filter(
      (f) => f.key === key || f.keys?.includes(key), // todo cache this
    );
    logMoreMatchingFields(matchingFields, key);

    // if more fields are matching, select the one which has fieldKey equal key
    const field =
      matchingFields.find((f) => f.fieldKey === key) ?? matchingFields?.[0];

    if (!field) {
      return undefined;
    }
    return getUiField(field, keysTodo, feature, key);
  });

const getFeaturedTags = (feature: Feature) => {
  const { tags } = feature;

  const matchedKeys = FEATURED_KEYS.map(({ matcher }) =>
    Object.keys(feature.tags).filter((key) => matcher.test(key)),
  ).flat();

  return matchedKeys.reduce(
    (acc, key) => (tags[key] ? { ...acc, [key]: tags[key] } : acc),
    {} as FeatureTags,
  );
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  keysTodo.init(feature);
  keysTodo.resolveTags(preset.tags); // remove tags which are already covered by Preset
  keysTodo.remove('name'); // always rendered by FeaturePanel
  keysTodo.removeByRegexp(/^(image$|type$|wikimedia_commons)/); // images are rendered in FeatureImages
  if (feature.tags.climbing) {
    keysTodo.removeByRegexp(/^(sport|type|site)$/);
  }

  const featuredTags = feature.deleted ? {} : getFeaturedTags(feature);
  keysTodo.resolveTags(featuredTags);

  const matchedFields = matchFieldsFromPreset(preset, keysTodo, feature);
  keysTodo.resolveFields(matchedFields);

  const tagsWithFields = matchRestToFields(keysTodo, feature);
  keysTodo.resolveFields(tagsWithFields);

  return {
    presetKey: preset.presetKey,
    preset,
    label: getPresetTranslation(preset.presetKey),
    featuredTags: Object.entries(featuredTags),
    matchedFields,
    tagsWithFields,
    keysTodo: keysTodo.state,
  };
};

export const addSchemaToFeature = (feature: Feature): Feature => {
  let schema;
  try {
    schema = getSchemaForFeature(feature); // TODO forward lang here ?? maybe full intl?
  } catch (e) {
    // TODO sentry
    console.error(`getSchemaForFeature(${getShortId(feature.osmMeta)}):`, e); // eslint-disable-line no-console
    return feature;
  }

  return { ...feature, schema };
};
