import { Field } from '../../../../../../services/tagging/types/Fields';
import { FieldTranslation } from '../../../../../../services/tagging/types/Presets';
import { deduplicate } from '../../../../../../services/tagging/utils';

export type FieldOption = {
  value: string;
  label: string;
};

/**
 * The OSM tag key a field primarily edits. Most fields use `key`, some only
 * define `keys` (e.g. access, manyCombo), in which case we take the first one.
 */
export const getPrimaryKey = (field: Field): string =>
  field.key ?? field.keys?.[0];

const optionLabel = (
  value: string,
  translated: FieldTranslation['options'] | undefined,
): string => {
  const tr = translated?.[value];
  if (typeof tr === 'string') return tr;
  if (tr && typeof tr === 'object' && 'title' in tr) return tr.title;
  return value;
};

/**
 * Builds the list of selectable options for combo-like fields. Merges the
 * untranslated `field.options` (canonical order) with any translated options
 * coming from the iD schema translation.
 */
export const getFieldOptions = (
  field: Field,
  fieldTranslation: FieldTranslation | undefined,
): FieldOption[] => {
  const translated = fieldTranslation?.options;
  const fromField = field.options ?? [];
  const fromTranslation = translated ? Object.keys(translated) : [];
  const values = deduplicate([...fromField, ...fromTranslation]).filter(
    (value) => value !== 'undefined', // pseudo-option used by checks to mark "unset"
  );

  return values.map((value) => ({
    value,
    label: optionLabel(value, translated),
  }));
};
